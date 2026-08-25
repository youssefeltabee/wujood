"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Badge, Button } from "@/components/ui";
import { RadarChart } from "@/components/audit/RadarChart";
import { siteConfig } from "@/config/site";

interface AuditData {
  id: string;
  url: string;
  totalScore: number;
  ghostLabel: { en: string; ar: string };
  categories: Record<string, number>;
}

const scoreText = (s: number) =>
  s <= 25 ? "text-score-low" : s <= 50 ? "text-score-midlow" : s <= 75 ? "text-score-mid" : "text-score-high";

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
        const audit: Record<string, unknown> = d.audit;
        const categories: Record<string, number> = {};
        siteConfig.auditCategories.forEach((cat) => {
          categories[cat.key] = (audit[cat.key] as number) || 0;
        });
        const total = Object.values(categories).reduce((a: number, b) => a + (b as number), 0);
        const level = siteConfig.ghostLevels.find((l) => total <= l.max) || siteConfig.ghostLevels[siteConfig.ghostLevels.length - 1];
        setData({ id: audit.id as string, url: audit.url as string, totalScore: total, ghostLabel: level.label, categories });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

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

  const chartData = useMemo(
    () => !data ? [] : Object.entries(data.categories).map(([key, val]) => ({
      category: siteConfig.auditCategories.find((c) => c.key === key)?.label.en || key,
      score: val,
    })),
    [data]
  );

  if (loading) return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10" aria-hidden="true">
      <div className="skeleton mb-2 h-4 w-28 rounded" />
      <div className="skeleton mb-8 h-8 w-72 rounded-lg" />
      <div className="mb-lg grid gap-6 md:grid-cols-2">
        <div className="skeleton h-64 rounded-2xl" />
        <div className="skeleton h-64 rounded-2xl" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}
      </div>
    </div>
  );

  if (!data) return (
    <div className="mx-auto w-full max-w-4xl px-6 py-16">
      <div className="card-lux p-10 text-center hover:translate-y-0">
        <p className="section-label justify-center">Ghost Audit</p>
        <p className="mt-4 text-lg font-medium text-text-primary">Audit not found.</p>
        <Link href="/dashboard" className="mt-4 inline-block text-sm text-accent-gold hover:underline focus-ring-gold rounded">
          Back to dashboard
        </Link>
      </div>
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      {/* Header band */}
      <header className="mb-lg flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="section-label mb-2">Ghost Audit</p>
          <h1 className="truncate text-2xl font-bold text-text-primary md:text-3xl">{data.url}</h1>
        </div>
        <Badge variant={scoreBadge(data.totalScore) as "success" | "warning" | "danger"} size="md">
          {data.ghostLabel.en} &middot; {data.totalScore}/100
        </Badge>
      </header>

      {/* Hero: score + radar */}
      <div className="mb-lg grid gap-6 md:grid-cols-2">
        <section aria-label="Total score" className="card-lux flex flex-col items-center justify-center p-10 text-center">
          <p className="section-label mb-6">Total Score</p>
          <p className={`stat-value text-7xl font-bold leading-none ${scoreText(data.totalScore)}`}>
            {data.totalScore}
            <span className="text-2xl text-text-muted">/100</span>
          </p>
          <p className="mt-5 text-xl text-text-primary">{data.ghostLabel.en}</p>
          <p className="mt-1 text-text-secondary" dir="rtl">{data.ghostLabel.ar}</p>
        </section>

        <section aria-label="Radar overview" className="card-lux p-6">
          <h2 className="mb-4 text-sm uppercase tracking-wide text-text-secondary">Radar Overview</h2>
          <RadarChart data={chartData} />
        </section>
      </div>

      {/* Category breakdown */}
      <section aria-label="Category breakdown">
        <p className="section-label mb-2">Diagnosis</p>
        <h2 className="mb-5 text-lg font-semibold text-text-primary">Category Breakdown</h2>
        <div className="animate-stagger space-y-3">
          {Object.entries(data.categories).map(([key, val]) => (
            <article key={key} className="card-lux grid items-center gap-x-6 gap-y-3 p-5 sm:grid-cols-[1fr_auto]">
              <div className="min-w-0">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-sm font-medium text-text-primary">{labels[key]?.en || key}</h3>
                  <span className="shrink-0 ps-4 text-xs text-text-muted" dir="rtl">{labels[key]?.ar}</span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-border-subtle" role="img" aria-label={`${val} out of 10`}>
                  <div
                    className="h-full rounded-full bg-accent-gold transition-all duration-700"
                    style={{ width: `${Math.min(val, 10) * 10}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-text-muted">{descriptions[key]?.en || ""}</p>
              </div>
              <p className={`stat-value text-end text-3xl font-bold sm:text-end ${scoreText(val * 10)}`}>
                {val}
                <span className="text-sm font-medium text-text-muted">/10</span>
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Actions */}
      <div className="mt-lg flex flex-wrap items-center justify-center gap-4">
        <a href={`/api/audit/${data.id}/pdf`} download className="focus-ring-gold rounded-lg">
          <Button variant="primary" size="lg" leftIcon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          }>
            Download PDF Report
          </Button>
        </a>
        <Link href="/dashboard" className="focus-ring-gold rounded-lg">
          <Button variant="secondary" size="lg">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
