export type AuditScore = {
  mobileScore: number;
  speedScore: number;
  seoScore: number;
  contentScore: number;
  socialScore: number;
  pricingScore: number;
  paymentScore: number;
  aiScore: number;
  trustScore: number;
  contactScore: number;
  totalScore: number;
};

export type AuditRecord = {
  id: string;
  userId: string;
  url: string;
  totalScore: number;
  scores: AuditScore;
  createdAt: Date;
  deletedAt: Date | null;
};
