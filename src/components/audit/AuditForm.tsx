"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AuditForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!url.trim()) { setError("Enter a URL"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Audit failed"); setLoading(false); return; }
      router.push(`/audit/${data.audit.id}`);
    } catch {
      setError("Network error");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex gap-2">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="example.com"
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-lg rtl:text-right"
          dir="auto"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Scanning..." : "Audit"}
        </button>
      </div>
      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
    </form>
  );
}
