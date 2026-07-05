import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PLANS } from "@/lib/stripe"
import Link from "next/link"

export default async function SubscriptionPage() {
  const user = await getSession()
  if (!user) redirect("/login")
  const sub = await prisma.subscription.findUnique({ where: { userId: user.id } })
  const plan = sub?.planKey ? PLANS[sub.planKey as keyof typeof PLANS] : null

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">الباقة والاشتراك</h1>
      <Card>
        {sub ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div><p className="text-lg font-semibold text-gray-900">{plan?.name || "غير معروفة"}</p><p className="text-sm text-gray-500">{sub.status === "active" ? "نشط" : sub.status === "canceled" ? "ملغي" : "معلق"}</p></div>
              <Badge variant={sub.status === "active" ? "success" : "danger"}>{sub.status}</Badge>
            </div>
            <p className="text-3xl font-bold text-gray-900">{plan?.amount?.toLocaleString() || "—"} <span className="text-base font-normal text-gray-500">ج.م / شهرياً</span></p>
            {sub.status === "active" && sub.stripeSubscriptionId && <Link href={"/api/stripe/portal"}><Button variant="outline">إدارة الاشتراك</Button></Link>}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">ليس لديك باقة نشطة حالياً</p>
            <Link href="/pricing"><Button variant="brand">اختر باقة</Button></Link>
          </div>
        )}
      </Card>
    </div>
  )
}
