import { describe, it, expect } from "vitest";

describe("rateLimit", () => {
  it("returns success on first call", async () => {
    const { rateLimit } = await import("../rate-limit");
    const result = await rateLimit("test-key-" + Date.now(), 5);
    expect(result.success).toBe(true);
  });
});
