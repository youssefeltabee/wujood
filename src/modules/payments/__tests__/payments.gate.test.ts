import { describe, it, expect } from "vitest";
import { assertTierPayment, type TierGatePayment } from "../payments.gate";

const DAY_MS = 86_400_000;

function pay(overrides: Partial<TierGatePayment> = {}): TierGatePayment {
  return {
    status: "COMPLETED",
    metadata: { tier: "kashif" },
    createdAt: new Date(Date.now() - 5 * DAY_MS),
    ...overrides,
  };
}

describe("assertTierPayment", () => {
  it("passes when a completed matching-tier payment exists within 35 days", () => {
    expect(assertTierPayment([pay()], "kashif").ok).toBe(true);
  });

  it("rejects an expired payment older than 35 days", () => {
    expect(assertTierPayment([pay({ createdAt: new Date(Date.now() - 40 * DAY_MS) })], "kashif").ok).toBe(false);
  });

  it("accepts a payment exactly 35 days old", () => {
    expect(assertTierPayment([pay({ createdAt: new Date(Date.now() - 35 * DAY_MS) })], "kashif").ok).toBe(true);
  });

  it("rejects a payment for a different tier", () => {
    expect(assertTierPayment([pay({ metadata: { tier: "pro" } })], "kashif").ok).toBe(false);
  });

  it("rejects payments that are not completed", () => {
    expect(assertTierPayment([pay({ status: "PENDING" })], "kashif").ok).toBe(false);
    expect(assertTierPayment([pay({ status: "FAILED" })], "kashif").ok).toBe(false);
  });

  it("ignores payments without tier metadata", () => {
    expect(assertTierPayment([pay({ metadata: {} })], "kashif").ok).toBe(false);
  });

  it("multiple payments: latest wins regardless of input order", () => {
    const expired = pay({ createdAt: new Date(Date.now() - 40 * DAY_MS) });
    const fresh = pay({ createdAt: new Date(Date.now() - 2 * DAY_MS) });
    expect(assertTierPayment([expired, fresh], "kashif").ok).toBe(true);
    expect(assertTierPayment([fresh, expired], "kashif").ok).toBe(true);
  });

  it("empty payment list fails", () => {
    expect(assertTierPayment([], "kashif").ok).toBe(false);
  });
});
