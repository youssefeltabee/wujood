"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, Badge, Skeleton, Button } from "@/components/ui";
import { AuditForm } from "@/components/audit/AuditForm";

interface Audit {
  id: string;
  url: string;
  totalScore: number;
  createdAt: string;
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: React.ReactNode; color?: string }) {
  return (
    <Card variant="elevated" padding="md">
      <div className="flex items-center gap-3 mb-2">
        <div className="size-8 rounded-lg bg-bg-elevated flex items-center justify-center text-accent-gold">
          {icon}
        </div>
        <p className="text-xs text-text-secondary uppercase tracking-wide">{label}</p>
      </div>
      <p className={`text-2xl font-bold ${color || "text-text-primary"}`}>{value}</p>
    </Card>
  );
}

const dateFormatter = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" });

const scoreColor = (s: number) =>
  s <= 25 ? "text-score-low" : s <= 50 ? "text-score-midlow" : s <= 75 ? "text-score-mid" : "text-score-high";

const scoreLevel = (s: number) =>
  s <= 25 ? "Ghost" : s <= 50 ? "Faint" : s <= 75 ? "Visible" : "Present";

const scoreBadge = (s: number) =>
  s <= 25 ? "danger" : s <= 50 ? "warning" : s <= 75 ? "warning" : "success";

function scoreBorder(s: number) {
  if (s <= 25) return "border-score-low/20 hover:border-score-low/40";
  if (s <= 50) return "border-score-midlow/20 hover:border-score-midlow/40";
  if (s <= 75) return "border-score-mid/20 hover:border-score-mid/40";
  return "border-score-high/20 hover:border-score-high/40";
}

function scoreBg(s: number) {
  if (s <= 25) return "bg-score-low/5";
  if (s <= 50) return "bg-score-midlow/5";
  if (s <= 75) return "bg-score-mid/5";
  return "bg-score-high/5";
}

export default function DashboardPage() {
  const [audits, setAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/audit")
      .then(async (r) => {
        if (!r.ok) {
          if (r.status === 401) { window.location.href = "/login"; return; }
          throw new Error("Failed to fetch");
        }
        return r.json();
      })
      .then((d) => { if (d) setAudits(d.audits || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const lastScore = audits.length > 0 ? audits[0].totalScore : null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-text-primary mb-1">Your Business Pulse</h1>
        <p className="text-text-secondary">Audit history and new scans.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-3 gap-4 mb-10">
          <Skeleton variant="card" />
          <Skeleton variant="card" />
          <Skeleton variant="card" />
        </div>
      ) : lastScore !== null ? (
        <div className="grid grid-cols-3 gap-4 mb-10">
          <StatCard
            icon={
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            }
            label="Total Audits"
            value={audits.length}
          />
          <StatCard
            icon={
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            }
            label="Latest Score"
            value={`${lastScore}/100`}
            color={scoreColor(lastScore)}
          />
          <StatCard
            icon={
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            }
            label="Status"
            value={scoreLevel(lastScore)}
            color={scoreColor(lastScore)}
          />
        </div>
      ) : null}

      <Card variant="elevated" padding="md" className="mb-10">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Run a New Audit</h2>
        <AuditForm />
      </Card>

      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Recent Audits</h2>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} variant="card" className="h-[72px]" />
            ))}
          </div>
        ) : audits.length === 0 ? (
          <Card variant="surface" padding="lg" className="text-center py-16">
            <svg className="size-12 mx-auto text-text-muted mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <p className="text-text-muted font-medium">No audits yet</p>
            <p className="text-text-muted text-sm mt-1">Enter a URL above to scan your first site.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {audits.slice(0, 10).map((a) => (
              <Link
                key={a.id}
                href={`/audit/${a.id}`}
                className={`block border rounded-xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${scoreBorder(a.totalScore)} ${scoreBg(a.totalScore)}`}
              >
                <div className="flex justify-between items-center">
                  <div className="min-w-0 mr-4">
                    <p className="font-medium text-text-primary truncate">{a.url}</p>
                    <p className="text-sm text-text-secondary mt-0.5">{dateFormatter.format(new Date(a.createdAt))}</p>
                  </div>
                  <Badge variant={scoreBadge(a.totalScore) as "success" | "warning" | "danger"}>
                    {a.totalScore}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
