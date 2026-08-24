const GATE_WINDOW_MS = 35 * 24 * 60 * 60 * 1000;

export type TierGatePayment = {
  status: string;
  metadata?: unknown;
  createdAt: Date;
};

export function assertTierPayment(payments: TierGatePayment[], targetTier: string): { ok: boolean } {
  const latest = payments
    .filter(
      (p) =>
        p.status === "completed" &&
        (p.metadata as Record<string, unknown> | null)?.tier === targetTier,
    )
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];

  if (!latest) return { ok: false };
  return { ok: Date.now() - latest.createdAt.getTime() <= GATE_WINDOW_MS };
}
