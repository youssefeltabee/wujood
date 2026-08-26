"use client";

import Link from "next/link";
import { Badge, Skeleton } from "@/components/ui";
import { AuditForm } from "@/components/audit/AuditForm";
import { useAudits } from "@/hooks/use-audit";
import { EmptyState, PageHeader, SkeletonRows, StatCard } from "./_components/chrome";

interface Audit {
  id: string;
  url: string;
  totalScore: number;
  createdAt: string;
}

const dateFormatter = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" });

const scoreColor = (s: number) =>
  s <= 25 ? "text-score-low" : s <= 50 ? "text-score-midlow" : s <= 75 ? "text-score-mid" : "text-score-high";

const scoreLevel = (s: number) =>
  s <= 25 ? "Ghost" : s <= 50 ? "Faint" : s <= 75 ? "Visible" : "Present";

const scoreBadge = (s: number) =>
  s <= 25 ? "danger" : s <= 50 ? "warning" : s <= 75 ? "warning" : "success";

export default function DashboardPage() {
  const { data, isLoading: loading } = useAudits();
  const audits: Audit[] = data?.audits ?? [];

  const lastScore = audits.length > 0 ? audits[0].totalScore : null;

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <PageHeader
        eyebrow="Overview"
        title="Your Business Pulse"
        subtitle="Audit history and new scans."
      />

      <section aria-label="Key stats" className="mb-8">
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} variant="card" className="skeleton h-[104px] rounded-2xl" />
            ))}
          </div>
        ) : lastScore !== null ? (
          <div className="animate-stagger grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              }
              label="Total Audits"
              value={audits.length}
            />
            <StatCard
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              }
              label="Latest Score"
              value={`${lastScore}/100`}
              tone={scoreColor(lastScore)}
            />
            <StatCard
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              }
              label="Status"
              value={scoreLevel(lastScore)}
              tone={scoreColor(lastScore)}
            />
          </div>
        ) : null}
      </section>

      <section id="run-audit" aria-label="Run a new audit" className="mb-8 scroll-mt-20">
        <div className="card-lux p-6 hover:translate-y-0">
          <p className="section-label mb-2">New Scan</p>
          <h2 className="mb-5 text-lg font-semibold text-text-primary">Run a New Audit</h2>
          <AuditForm />
        </div>
      </section>

      <section aria-label="Recent audits">
        <p className="section-label mb-2">History</p>
        <h2 className="mb-5 text-lg font-semibold text-text-primary">Recent Audits</h2>
        {loading ? (
          <SkeletonRows rows={5} className="h-16" />
        ) : audits.length === 0 ? (
          <EmptyState
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            }
            title="No audits yet"
            hint="Enter a URL above to scan your first site."
            cta={
              <Link href="#run-audit">
                <Badge variant="gold">Start scanning</Badge>
              </Link>
            }
          />
        ) : (
          <div className="card-lux overflow-hidden hover:translate-y-0">
            <div className="overflow-x-auto">
              <table className="table-lux w-full text-sm">
                <thead>
                  <tr>
                    <th scope="col" className="px-6 pb-3 pt-5 text-start font-medium">Website</th>
                    <th scope="col" className="px-6 pb-3 pt-5 text-start font-medium">Scanned</th>
                    <th scope="col" className="px-6 pb-3 pt-5 text-end font-medium">Score</th>
                    <th scope="col" className="px-6 pb-3 pt-5 text-end font-medium"><span className="sr-only">Open</span></th>
                  </tr>
                </thead>
                <tbody>
                  {audits.slice(0, 10).map((a) => (
                    <tr key={a.id} className="group transition-colors">
                      <td className="px-6 pe-4">
                        <Link href={`/audit/${a.id}`} className="focus-ring-gold block max-w-xs truncate rounded font-medium text-text-primary group-hover:text-accent-gold">
                          {a.url}
                        </Link>
                      </td>
                      <td className="px-6 text-text-secondary">{dateFormatter.format(new Date(a.createdAt))}</td>
                      <td className="px-6 text-end">
                        <Badge variant={scoreBadge(a.totalScore) as "success" | "warning" | "danger"}>{a.totalScore}/100</Badge>
                      </td>
                      <td className="px-6 text-end">
                        <Link href={`/audit/${a.id}`} aria-label={`View audit report for ${a.url}`} className="focus-ring-gold inline-block rounded text-text-muted transition-colors group-hover:text-accent-gold">
                          <svg className="size-4 rtl:-scale-x-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
