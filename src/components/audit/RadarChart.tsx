"use client";

import { RadarChart as RC, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";

interface RadarChartProps {
  data: { category: string; score: number }[];
}

export function RadarChart({ data }: RadarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RC data={data}>
        <PolarGrid stroke="#E8DCC8" />
        <PolarAngleAxis dataKey="category" tick={{ fontSize: 10, fill: "#6b7280" }} />
        <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fontSize: 10, fill: "#9ca3af" }} />
        <Radar name="Score" dataKey="score" stroke="#0D7377" fill="#0D7377" fillOpacity={0.15} strokeWidth={2.5} />
        <Tooltip />
      </RC>
    </ResponsiveContainer>
  );
}
