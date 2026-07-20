import { MemoryCache } from "./cache";

interface RateLimitConfig {
  interval: number;
  maxRequests: number;
}

const limits = new Map<string, MemoryCache<number[]>>();

export function rateLimit(key: string, config: RateLimitConfig): { allowed: boolean; remaining: number } {
  let cache = limits.get(key);
  if (!cache) {
    cache = new MemoryCache<number[]>(config.interval);
    limits.set(key, cache);
  }

  const now = Date.now();
  const timestamps = cache.get(key)?.filter((t) => now - t < config.interval) || [];
  if (timestamps.length >= config.maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  timestamps.push(now);
  cache.set(key, timestamps);
  return { allowed: true, remaining: config.maxRequests - timestamps.length };
}
