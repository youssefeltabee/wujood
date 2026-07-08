"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Button } from "@/components/ui";

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
        <div className="flex-1">
          <Input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="example.com"
            dir="auto"
            autoComplete="url"
            error={error}
            required
          />
        </div>
        <Button type="submit" isLoading={loading} size="md" className="min-w-[120px]">
          See Your Score
        </Button>
      </div>
    </form>
  );
}
