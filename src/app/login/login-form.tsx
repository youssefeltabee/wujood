"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) { setError("الرجاء ملء جميع الحقول"); return }
    setLoading(true); setError("")
    try {
      const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "فشل تسجيل الدخول")
      router.push("/dashboard")
      router.refresh()
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="البريد الإلكتروني" type="email" id="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input label="كلمة المرور" type="password" id="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" variant="brand" className="w-full" disabled={loading}>{loading ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}</Button>
      <p className="text-center text-sm text-gray-500 mt-4">ليس لديك حساب؟ <Link href="/register" className="text-indigo-600 hover:underline">إنشاء حساب جديد</Link></p>
    </form>
  )
}
