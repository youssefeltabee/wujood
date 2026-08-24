import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

// ponytail: in-memory fallback when Upstash not configured — fine for single-instance serverless, won't work for multi-region
const hits = new Map<string, { count: number; resetAt: number }>();

function memoryRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1, allowed: true };
  }
  entry.count++;
  if (entry.count > limit) {
    return { success: false, remaining: 0, allowed: false };
  }
  return { success: true, remaining: limit - entry.count, allowed: true };
}

const redis = UPSTASH_URL && UPSTASH_TOKEN ? Redis.fromEnv() : null;

// ponytail: per-profile Ratelimit cache — unbounded only if callers pass ever-new option combos; bounded set in practice
const limiters = new Map<string, Ratelimit>();

function getLimiter(redis: Redis, maxRequests: number, intervalMs: number): Ratelimit {
  const cacheKey = `${maxRequests}:${intervalMs}`;
  let rl = limiters.get(cacheKey);
  if (!rl) {
    rl = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(maxRequests, `${intervalMs} ms`),
      analytics: true,
    });
    limiters.set(cacheKey, rl);
  }
  return rl;
}

type RateLimitOptions = { interval?: number; maxRequests?: number };

export async function rateLimit(key: string, opts?: RateLimitOptions | number) {
  const limit = typeof opts === "number" ? opts : opts?.maxRequests ?? 10;
  const windowMs = typeof opts === "object" ? (opts.interval ?? 10_000) : 10_000;

  if (redis) {
    const result = await getLimiter(redis, limit, windowMs).limit(key);
    return { success: result.success, remaining: result.remaining, allowed: result.success };
  }
  return memoryRateLimit(key, limit, windowMs);
}
