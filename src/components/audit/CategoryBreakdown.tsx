"use client";

interface CategoryBreakdownProps {
  categories: Record<string, number>;
  labels: Record<string, { en: string; ar: string }>;
  descriptions: Record<string, { en: string; ar: string }>;
}

const barColor = (s: number) =>
  s <= 3 ? "bg-red-500" : s <= 6 ? "bg-orange-500" : s <= 8 ? "bg-yellow-500" : "bg-green-500";

export function CategoryBreakdown({ categories, labels, descriptions }: CategoryBreakdownProps) {
  return (
    <div className="space-y-4">
      {Object.entries(categories).map(([key, val]) => (
        <div key={key}>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">{labels[key]?.en || key}</span>
            <span className="text-gray-500">{val}/10</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${barColor(val)}`} style={{ width: `${val * 10}%` }} />
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{descriptions[key]?.en || ""}</p>
        </div>
      ))}
    </div>
  );
}
