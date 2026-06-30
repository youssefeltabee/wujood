"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AuditForm } from "@/components/audit/AuditForm";

interface Audit {
  id: number;
  url: string;
  totalScore: number;
  createdAt: string;
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

  const levelColor = (s: number) =>
    s <= 25 ? "text-red-500" : s <= 50 ? "text-orange-500" : s <= 75 ? "text-yellow-600" : "text-green-500";

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#1e3a5f] mb-6">Your Dashboard</h1>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Run a New Audit</h2>
        <AuditForm />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Recent Audits</h2>
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : audits.length === 0 ? (
          <p className="text-gray-400">No audits yet. Enter a URL above to get started.</p>
        ) : (
          <div className="space-y-3">
            {audits.map((a) => (
              <Link key={a.id} href={`/audit/${a.id}`} className="block border rounded-lg p-4 hover:border-blue-300 transition">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">{a.url}</p>
                    <p className="text-sm text-gray-400">{new Date(a.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className={`text-2xl font-bold ${levelColor(a.totalScore)}`}>
                    {a.totalScore}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
