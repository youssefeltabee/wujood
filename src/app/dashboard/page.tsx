"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AuditForm } from "@/components/audit/AuditForm";

interface Audit {
  id: string;
  url: string;
  totalScore: number;
  createdAt: string;
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: React.ReactNode; color?: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-w-sand/30">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-lg bg-w-cream flex items-center justify-center text-w-teal">
          {icon}
        </div>
        <p className="text-xs text-w-charcoal/40 uppercase tracking-wide">{label}</p>
      </div>
      <p className={`text-2xl font-bold ${color || "text-w-charcoal"}`}>{value}</p>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-w-sand/30 animate-pulse">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-lg bg-gray-100" />
        <div className="h-3 w-20 bg-gray-100 rounded" />
      </div>
      <div className="h-7 w-16 bg-gray-100 rounded mt-1" />
    </div>
  );
}

export default function DashboardPage() {
  const [audits, setAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/audit")
      .then((r) => r.json())
      .then((d) => { setAudits(d.audits || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const scoreColor = (s: number) =>
    s <= 25 ? "text-red-500" : s <= 50 ? "text-orange-500" : s <= 75 ? "text-yellow-600" : "text-green-600";

  const scoreLevel = (s: number) =>
    s <= 25 ? "Ghost" : s <= 50 ? "Faint" : s <= 75 ? "Visible" : "Present";

  const lastScore = audits.length > 0 ? audits[0].totalScore : null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-w-charcoal mb-1">Your Business Pulse</h1>
        <p className="text-w-charcoal/50">Audit history and new scans.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-3 gap-4 mb-10">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : lastScore !== null ? (
        <div className="grid grid-cols-3 gap-4 mb-10">
          <StatCard
            icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>}
            label="Total Audits"
            value={audits.length}
          />
          <StatCard
            icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>}
            label="Latest Score"
            value={`${lastScore}/100`}
            color={scoreColor(lastScore)}
          />
          <StatCard
            icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>}
            label="Status"
            value={scoreLevel(lastScore)}
            color={scoreColor(lastScore)}
          />
        </div>
      ) : null}

      <div className="bg-w-cream rounded-2xl p-6 border border-w-sand/30 mb-10">
        <h2 className="text-lg font-semibold text-w-charcoal mb-4">Run a New Audit</h2>
        <AuditForm />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-w-charcoal mb-4">Recent Audits</h2>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-w-sand/30 rounded-xl p-5 animate-pulse">
                <div className="flex justify-between">
                  <div className="space-y-2 flex-1 mr-4">
                    <div className="h-4 w-48 bg-gray-100 rounded" />
                    <div className="h-3 w-24 bg-gray-100 rounded" />
                  </div>
                  <div className="h-7 w-12 bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : audits.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-w-sand/30">
            <svg className="w-12 h-12 mx-auto text-w-sand mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <p className="text-w-charcoal/40 font-medium">No audits yet</p>
            <p className="text-w-charcoal/30 text-sm mt-1">Enter a URL above to scan your first site.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {audits.slice(0, 10).map((a) => {
              const bg = a.totalScore <= 25 ? "bg-red-50 border-red-200" : a.totalScore <= 50 ? "bg-orange-50 border-orange-200" : a.totalScore <= 75 ? "bg-yellow-50 border-yellow-200" : "bg-green-50 border-green-200";
              return (
                <Link
                  key={a.id}
                  href={`/audit/${a.id}`}
                  className={`block border rounded-xl p-5 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer hover:shadow-md ${bg}`}
                >
                  <div className="flex justify-between items-center">
                    <div className="min-w-0 mr-4">
                      <p className="font-medium text-w-charcoal truncate">{a.url}</p>
                      <p className="text-sm text-w-charcoal/40 mt-0.5">{new Date(a.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</p>
                    </div>
                    <div className={`text-2xl font-bold shrink-0 ${a.totalScore <= 25 ? "text-red-500" : a.totalScore <= 50 ? "text-orange-500" : a.totalScore <= 75 ? "text-yellow-600" : "text-green-600"}`}>
                      {a.totalScore}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
