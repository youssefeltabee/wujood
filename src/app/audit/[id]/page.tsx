"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ScoreCard } from "@/components/audit/ScoreCard";
import { CategoryBreakdown } from "@/components/audit/CategoryBreakdown";
import { RadarChart } from "@/components/audit/RadarChart";
import { siteConfig } from "@/config/site";

interface AuditData {
  id: number;
  url: string;
  totalScore: number;
  ghostLabel: { en: string; ar: string };
  categories: Record<string, number>;
}

export default function AuditPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<AuditData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/audit")
      .then((r) => r.json())
      .then((d) => {
        const audit = (d.audits || []).find((a: any) => String(a.id) === id);
        if (audit) {
          const categories: Record<string, number> = {};
          siteConfig.auditCategories.forEach((cat) => {
            categories[cat.key] = (audit as any)[cat.key] || 0;
          });
          const total = Object.values(categories).reduce((a: number, b) => a + (b as number), 0);
          const level = siteConfig.ghostLevels.find((l) => total <= l.max) || siteConfig.ghostLevels[siteConfig.ghostLevels.length - 1];
          setData({ id: audit.id, url: audit.url, totalScore: total, ghostLabel: level.label, categories });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-12 text-center text-gray-400">Loading report...</div>;
  if (!data) return <div className="max-w-4xl mx-auto px-4 py-12 text-center text-gray-400">Audit not found.</div>;

  const chartData = Object.entries(data.categories).map(([key, val]) => ({
    category: siteConfig.auditCategories.find((c) => c.key === key)?.label.en || key,
    score: val,
  }));

  const labels: Record<string, { en: string; ar: string }> = {};
  const descriptions: Record<string, { en: string; ar: string }> = {};
  siteConfig.auditCategories.forEach((c) => {
    labels[c.key] = c.label;
    descriptions[c.key] = c.desc;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1e3a5f]">Ghost Audit Report</h1>
        <p className="text-gray-500">{data.url}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <ScoreCard score={data.totalScore} label={data.ghostLabel} />
        <div className="border rounded-xl p-4">
          <RadarChart data={chartData} />
        </div>
      </div>

      <div className="border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Category Breakdown</h2>
        <CategoryBreakdown categories={data.categories} labels={labels} descriptions={descriptions} />
      </div>

      <div className="mt-6 text-center">
        <a
          href={`/api/audit/${data.id}/pdf`}
          className="inline-block bg-[#1e3a5f] text-white px-6 py-2 rounded-lg hover:bg-[#162d4a]"
        >
          Download PDF Report
        </a>
      </div>
    </div>
  );
}
