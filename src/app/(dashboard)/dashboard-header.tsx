"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function DashboardHeader() {
  const router = useRouter()

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/")
    router.refresh()
  }

  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6">
      <h2 className="text-lg font-semibold text-gray-900">لوحة التحكم</h2>
      <Button variant="ghost" size="sm" onClick={handleLogout}>تسجيل الخروج</Button>
    </header>
  )
}
