import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { ratelimitInstances } = vi.hoisted(() => ({
  ratelimitInstances: [] as Array<{
    redis: unknown;
    limiter: unknown;
    limitCalls: string[];
  }>,
}));

vi.mock("@upstash/redis", () => ({
  Redis: {
    fromEnv: () => ({ fake: "redis-client" }),
  },
}));

vi.mock("@upstash/ratelimit", () => {
  class FakeRatelimit {
    redis: unknown;
    limiter: unknown;
    limitCalls: string[] = [];
    constructor(config: { redis: unknown; limiter: unknown }) {
      this.redis = config.redis;
      this.limiter = config.limiter;
      ratelimitInstances.push(this);
    }
    async limit(key: string) {
      this.limitCalls.push(key);
      return { success: true, limit: 10, remaining: 9, reset: Date.now() };
    }
    static slidingWindow(maxRequests: number, window: string) {
      return { type: "slidingWindow", maxRequests, window };
    }
  }
  return { Ratelimit: FakeRatelimit };
});

async function importRateLimitWithUpstash() {
  vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://example.upstash.io");
  vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "test-token");
  return import("../rate-limit");
}

beforeEach(() => {
  vi.resetModules();
  ratelimitInstances.length = 0;
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("rateLimit", () => {
  it("returns success on first call", async () => {
    const { rateLimit } = await import("../rate-limit");
    const result = await rateLimit("test-key-" + Date.now(), 5);
    expect(result.success).toBe(true);
  });

  it("memory fallback honors maxRequests within interval", async () => {
    const { rateLimit } = await import("../rate-limit");
    const key = "mem-" + Math.random();
    for (let i = 0; i < 5; i++) {
      const result = await rateLimit(key, { interval: 60_000, maxRequests: 5 });
      expect(result.success).toBe(true);
    }
    const blocked = await rateLimit(key, { interval: 60_000, maxRequests: 5 });
    expect(blocked.success).toBe(false);
  });

  it("distinct option sets produce distinct Upstash limiters", async () => {
    const { rateLimit } = await importRateLimitWithUpstash();
    await rateLimit("login:1", { interval: 60_000, maxRequests: 5 });
    await rateLimit("audit:1", { interval: 10_000, maxRequests: 10 });

    expect(ratelimitInstances).toHaveLength(2);
    expect(ratelimitInstances[0].limiter).toEqual({
      type: "slidingWindow",
      maxRequests: 5,
      window: "60000 ms",
    });
    expect(ratelimitInstances[1].limiter).toEqual({
      type: "slidingWindow",
      maxRequests: 10,
      window: "10000 ms",
    });
    expect(ratelimitInstances[0].redis).toEqual({ fake: "redis-client" });
    expect(ratelimitInstances[0].limitCalls).toEqual(["login:1"]);
    expect(ratelimitInstances[1].limitCalls).toEqual(["audit:1"]);
  });

  it("identical options reuse the cached Upstash limiter", async () => {
    const { rateLimit } = await importRateLimitWithUpstash();
    const opts = { interval: 60_000, maxRequests: 5 };
    await rateLimit("login:a", opts);
    await rateLimit("audit:x", { interval: 10_000, maxRequests: 10 });
    await rateLimit("login:b", opts);

    expect(ratelimitInstances).toHaveLength(2);
    expect(ratelimitInstances[0].limiter).toEqual({
      type: "slidingWindow",
      maxRequests: 5,
      window: "60000 ms",
    });
    expect(ratelimitInstances[1].limiter).toEqual({
      type: "slidingWindow",
      maxRequests: 10,
      window: "10000 ms",
    });
    expect(ratelimitInstances[0].limitCalls).toEqual(["login:a", "login:b"]);
    expect(ratelimitInstances[1].limitCalls).toEqual(["audit:x"]);
  });
});
