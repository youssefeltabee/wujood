"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, Badge, Spinner, Button } from "@/components/ui";
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

const scoreBadge = (s: number) =>
  s <= 25 ? "danger" : s <= 50 ? "warning" : s <= 75 ? "warning" : "success";

export default function AuditPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<AuditData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/audit/${id}`)
      .then(async (r) => {
        if (r.status === 401) { window.location.href = "/login"; return; }
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((d) => {
        if (!d) return;
        const audit = d.audit;
        const categories: Record<string, number> = {};
        siteConfig.auditCategories.forEach((cat) => {
          categories[cat.key] = (audit as any)[cat.key] || 0;
        });
        const total = Object.values(categories).reduce((a: number, b) => a + (b as number), 0);
        const level = siteConfig.ghostLevels.find((l) => total <= l.max) || siteConfig.ghostLevels[siteConfig.ghostLevels.length - 1];
        setData({ id: audit.id, url: audit.url, totalScore: total, ghostLabel: level.label, categories });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-center">
      <div className="flex items-center justify-center gap-2 text-text-muted">
        <Spinner size="sm" />
        Loading report...
      </div>
    </div>
  );
  if (!data) return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-center text-text-muted">
      Audit not found.
    </div>
  );

  const chartData = useMemo(
    () => Object.entries(data.categories).map(([key, val]) => ({
      category: siteConfig.auditCategories.find((c) => c.key === key)?.label.en || key,
      score: val,
    })),
    [data.categories]
  );

  const labels = useMemo(() => {
    const m: Record<string, { en: string; ar: string }> = {};
    siteConfig.auditCategories.forEach((c) => { m[c.key] = c.label; });
    return m;
  }, []);

  const descriptions = useMemo(() => {
    const m: Record<string, { en: string; ar: string }> = {};
    siteConfig.auditCategories.forEach((c) => { m[c.key] = c.desc; });
    return m;
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Ghost Audit Report</h1>
          <p className="text-text-secondary mt-0.5">{data.url}</p>
        </div>
        <Badge variant={scoreBadge(data.totalScore) as "success" | "warning" | "danger"} size="md">
          {data.totalScore}/100
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <ScoreCard score={data.totalScore} label={data.ghostLabel} />
        <Card variant="elevated" padding="md">
          <h2 className="text-sm font-semibold text-text-secondary mb-3 uppercase tracking-wide">Radar Overview</h2>
          <RadarChart data={chartData} />
        </Card>
      </div>

      <Card variant="elevated" padding="md">
        <h2 className="text-lg font-semibold text-text-primary mb-5">Category Breakdown</h2>
        <CategoryBreakdown categories={data.categories} labels={labels} descriptions={descriptions} />
      </Card>

      <div className="mt-8 flex justify-center gap-4">
        <a href={`/api/audit/${data.id}/pdf`}>
          <Button variant="primary" size="md" leftIcon={
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          }>
            Download PDF Report
          </Button>
        </a>
        <Link href="/dashboard">
          <Button variant="secondary" size="md">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
