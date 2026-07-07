"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const URL_PATTERN = /^[a-zA-Z0-9][-a-zA-Z0-9]*\.[a-zA-Z]{2,}/;

export function AuditForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const trimmed = url.trim();
    if (!trimmed) { setError("Enter a URL"); return; }
    if (!URL_PATTERN.test(trimmed)) { setError("Enter a valid domain (e.g., example.com)"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
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
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="example.com"
          className="flex-1 px-4 py-3 border border-border-subtle rounded-xl text-base bg-bg-elevated text-white placeholder-text-muted rtl:text-right transition-colors focus:border-accent-gold focus:outline-none focus:ring-2 focus:ring-accent-gold/20"
          dir="auto"
          autoComplete="url"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-accent-gold text-white rounded-xl font-semibold hover:brightness-110 disabled:opacity-60 transition-all duration-200 min-w-[120px] flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Scanning
            </>
          ) : (
            "See Your Score"
          )}
        </button>
      </div>
      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
    </form>
  );
}
