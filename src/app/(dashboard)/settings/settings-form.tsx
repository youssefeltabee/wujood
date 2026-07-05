"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SettingsForm({ user }: { user: { name: string; email: string; phone: string } }) {
  const [name, setName] = useState(user.name)
  const [phone, setPhone] = useState(user.phone)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setMessage("")
    try {
      const res = await fetch("/api/user/update", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, phone }) })
      if (!res.ok) throw new Error("فشل التحديث")
      setMessage("تم تحديث البيانات بنجاح")
    } catch { setMessage("حدث خطأ أثناء التحديث") }
    finally { setLoading(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <Input label="الاسم" id="name" value={name} onChange={(e) => setName(e.target.value)} />
      <Input label="البريد الإلكتروني" id="email" value={user.email} disabled />
      <Input label="رقم الهاتف" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
      {message && <p className="text-sm text-green-600">{message}</p>}
      <Button type="submit" variant="brand" disabled={loading}>{loading ? "جارٍ الحفظ..." : "حفظ التغييرات"}</Button>
    </form>
  )
}
