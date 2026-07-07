"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ScoreCard } from "@/components/audit/ScoreCard";
import { CategoryBreakdown } from "@/components/audit/CategoryBreakdown";
import { RadarChart } from "@/components/audit/RadarChart";
import { siteConfig } from "@/config/site";

interface AuditData {
  id: string;
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

  if (loading) return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-center">
      <div className="flex items-center justify-center gap-2 text-w-charcoal/40">
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Loading report...
      </div>
    </div>
  );
  if (!data) return <div className="max-w-4xl mx-auto px-6 py-16 text-center text-w-charcoal/40">Audit not found.</div>;

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
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-w-charcoal">Ghost Audit Report</h1>
        <p className="text-w-charcoal/50 mt-0.5">{data.url}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <ScoreCard score={data.totalScore} label={data.ghostLabel} />
        <div className="bg-white border border-w-sand/30 rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-w-charcoal/60 mb-3 uppercase tracking-wide">Radar Overview</h2>
          <RadarChart data={chartData} />
        </div>
      </div>

      <div className="bg-white border border-w-sand/30 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-w-charcoal mb-5">Category Breakdown</h2>
        <CategoryBreakdown categories={data.categories} labels={labels} descriptions={descriptions} />
      </div>

      <div className="mt-8 flex justify-center gap-4">
        <a
          href={`/api/audit/${data.id}/pdf`}
          className="inline-flex items-center gap-2 bg-w-teal text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-w-teal-dark transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Download PDF Report
        </a>
        <a
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-w-cream text-w-charcoal px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-w-cream-dark transition-colors"
        >
          Back to Dashboard
        </a>
      </div>
    </div>
  );
}
