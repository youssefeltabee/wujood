"use client";

import { Card, Badge } from "@/components/ui";

interface ScoreCardProps {
  score: number;
  label: { en: string; ar: string };
}

function levelBadge(s: number) {
  if (s <= 25) return { variant: "danger" as const, text: "Ghost" };
  if (s <= 50) return { variant: "warning" as const, text: "Faint" };
  if (s <= 75) return { variant: "warning" as const, text: "Visible" };
  return { variant: "success" as const, text: "Present" };
}

function scoreBorder(s: number) {
  if (s <= 25) return "border-score-low/30";
  if (s <= 50) return "border-score-midlow/30";
  if (s <= 75) return "border-score-mid/30";
  return "border-score-high/30";
}

function scoreBg(s: number) {
  if (s <= 25) return "bg-score-low/10";
  if (s <= 50) return "bg-score-midlow/10";
  if (s <= 75) return "bg-score-mid/10";
  return "bg-score-high/10";
}

export function ScoreCard({ score, label }: ScoreCardProps) {
  const badge = levelBadge(score);

  return (
    <Card variant="bordered" className={`text-center ${scoreBg(score)} ${scoreBorder(score)}`}>
      <div className="text-6xl font-bold">{score}/100</div>
      <div className="text-xl mt-2 text-text-primary">{label.en}</div>
      <div className="text-lg mt-1 text-text-secondary" dir="rtl">{label.ar}</div>
      <div className="mt-3">
        <Badge variant={badge.variant}>{badge.text}</Badge>
      </div>
    </Card>
  );
}
