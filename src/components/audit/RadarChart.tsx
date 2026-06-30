"use client";

import { RadarChart as RC, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";

interface RadarChartProps {
  data: { category: string; score: number }[];
}

export function RadarChart({ data }: RadarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RC data={data}>
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis dataKey="category" tick={{ fontSize: 10, fill: "#6b7280" }} />
        <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fontSize: 10, fill: "#9ca3af" }} />
        <Radar name="Score" dataKey="score" stroke="#2563eb" fill="#2563eb" fillOpacity={0.2} strokeWidth={2} />
        <Tooltip />
      </RC>
    </ResponsiveContainer>
  );
}
