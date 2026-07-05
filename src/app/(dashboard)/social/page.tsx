import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function SocialPage() {
  const user = await getSession()
  if (!user) redirect("/login")
  const accounts = await prisma.socialAccount.findMany({ where: { userId: user.id } })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">التواصل الاجتماعي</h1>
        <Link href="/dashboard/social/connect"><Button variant="brand">ربط حساب جديد</Button></Link>
      </div>
      {accounts.length === 0 ? (
        <Card><p className="text-gray-500 text-center py-8">لم يتم ربط أي حسابات تواصل اجتماعي بعد</p></Card>
      ) : (
        <div className="grid gap-4">
          {accounts.map((a) => (
            <Card key={a.id} className="flex items-center justify-between">
              <div><p className="font-medium text-gray-900">{a.platform}</p><p className="text-sm text-gray-500">{a.accountName}</p></div>
              <span className={`px-3 py-1 rounded-full text-xs ${a.connected ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{a.connected ? "متصل" : "غير متصل"}</span>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
