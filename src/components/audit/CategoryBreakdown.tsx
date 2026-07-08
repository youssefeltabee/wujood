"use client";

import { Card, Badge } from "@/components/ui";

interface CategoryBreakdownProps {
  categories: Record<string, number>;
  labels: Record<string, { en: string; ar: string }>;
  descriptions: Record<string, { en: string; ar: string }>;
}

const barColor = (s: number) =>
  s <= 3 ? "bg-score-low" : s <= 6 ? "bg-score-midlow" : s <= 8 ? "bg-score-mid" : "bg-score-high";

const badgeVariant = (s: number) =>
  s <= 3 ? "danger" : s <= 6 ? "warning" : s <= 8 ? "warning" : "success";

export function CategoryBreakdown({ categories, labels, descriptions }: CategoryBreakdownProps) {
  return (
    <div className="space-y-4">
      {Object.entries(categories).map(([key, val]) => (
        <Card key={key} variant="surface" padding="md">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-text-primary">
              {labels[key]?.en || key}
            </span>
            <Badge variant={badgeVariant(val)} size="sm">{val}/10</Badge>
          </div>
          <div className="h-2 bg-border-subtle rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${barColor(val)}`}
              style={{ width: `${val * 10}%` }}
            />
          </div>
          <p className="text-xs text-text-muted mt-1">{descriptions[key]?.en || ""}</p>
        </Card>
      ))}
    </div>
  );
}
