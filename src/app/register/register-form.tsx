"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !email || !password) { setError("الرجاء ملء جميع الحقول"); return }
    if (password.length < 8) { setError("كلمة المرور يجب أن تكون 8 أحرف على الأقل"); return }
    setLoading(true); setError("")
    try {
      const plan = searchParams.get("plan")
      const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, password, plan }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "فشل إنشاء الحساب")
      router.push("/dashboard")
      router.refresh()
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="الاسم" type="text" id="name" placeholder="محمد أحمد" value={name} onChange={(e) => setName(e.target.value)} />
      <Input label="البريد الإلكتروني" type="email" id="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input label="كلمة المرور" type="password" id="password" placeholder="8 أحرف على الأقل" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" variant="brand" className="w-full" disabled={loading}>{loading ? "جارٍ إنشاء الحساب..." : "إنشاء حساب"}</Button>
      <p className="text-center text-sm text-gray-500 mt-4">لديك حساب بالفعل؟ <Link href="/login" className="text-indigo-600 hover:underline">تسجيل الدخول</Link></p>
    </form>
  )
}
