"use client";

interface ScoreCardProps {
  score: number;
  label: { en: string; ar: string };
}

const levelColor = (s: number) =>
  s <= 25 ? "bg-score-low" : s <= 50 ? "bg-score-midlow" : s <= 75 ? "bg-score-mid" : "bg-score-high";

export function ScoreCard({ score, label }: ScoreCardProps) {
  return (
    <div className={`rounded-xl p-8 text-white text-center border border-border-subtle ${levelColor(score)}`}>
      <div className="text-6xl font-bold">{score}/100</div>
      <div className="text-xl mt-2 opacity-90">{label.en}</div>
      <div className="text-lg mt-1 opacity-75" dir="rtl">{label.ar}</div>
    </div>
  );
}
