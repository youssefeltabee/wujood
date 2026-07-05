"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function AuditForm() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!url.trim()) { setError("الرجاء إدخال رابط الموقع"); return }
    setLoading(true); setError(""); setResult(null)
    try {
      const res = await fetch("/api/audit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: url.trim() }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "فشل التدقيق")
      setResult(data)
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-1">
          <Input placeholder="https://example.com" value={url} onChange={(e) => setUrl(e.target.value)} />
        </div>
        <Button type="submit" variant="brand" disabled={loading}>{loading ? "جارٍ التدقيق..." : "دقق الآن"}</Button>
      </form>
      {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}
      {result && (
        <div className="mt-8 text-right">
          <div className="text-6xl font-bold gradient-text mb-4">{result.score}/100</div>
          <p className="text-gray-700 mb-6">{result.summary}</p>
          {result.categories?.map((cat: any) => (
            <div key={cat.name} className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className={cat.passed ? "text-green-600" : "text-red-600"}>{cat.passed ? "✓" : "✗"}</span>
              <span className="text-gray-700">{cat.name}</span>
              <span className="text-sm text-gray-500">{cat.score}/{cat.maxScore}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
