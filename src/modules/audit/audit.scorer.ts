import type { ScanResult } from "./audit.scanner";

export interface ScoreOutput {
  totalScore: number;
  categories: Record<string, number>;
  ghostLevel: "ghost" | "faint" | "visible" | "present";
  ghostLabel: { en: string; ar: string };
}

const levels = [
  { max: 25, level: "ghost" as const, label: { en: "Digital Ghost", ar: "شبح رقمي" } },
  { max: 50, level: "faint" as const, label: { en: "Faint Signal", ar: "إشارة ضعيفة" } },
  { max: 75, level: "visible" as const, label: { en: "Becoming Visible", ar: "في طور الظهور" } },
  { max: 100, level: "present" as const, label: { en: "Digitally Present", ar: "حاضر رقمياً" } },
];

export function computeScore(scan: ScanResult): ScoreOutput {
  const totalScore = scan.mobileScore + scan.speedScore + scan.seoScore +
    scan.contentScore + scan.socialScore + scan.pricingScore +
    scan.paymentScore + scan.aiScore + scan.trustScore + scan.contactScore;

  const matched = levels.find((l) => totalScore <= l.max) || levels[levels.length - 1];

  return {
    totalScore,
    categories: {
      mobileScore: scan.mobileScore, speedScore: scan.speedScore, seoScore: scan.seoScore,
      contentScore: scan.contentScore, socialScore: scan.socialScore,
      pricingScore: scan.pricingScore, paymentScore: scan.paymentScore,
      aiScore: scan.aiScore, trustScore: scan.trustScore, contactScore: scan.contactScore,
    },
    ghostLevel: matched.level,
    ghostLabel: matched.label,
  };
}
