import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { WebsitePreview } from "@/components/dashboard/website-preview"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function WebsitePage() {
  const user = await getSession()
  if (!user) redirect("/login")

  const website = await prisma.website.findFirst({ where: { userId: user.id }, include: { pages: true, template: true } })

  if (!website) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-gray-900 mb-4">ليس لديك موقع إلكتروني بعد</h2>
        <p className="text-gray-600 mb-8">اختر قالباً وابدأ في بناء موقعك الآن</p>
        <Link href="/dashboard/website/create"><Button variant="brand">إنشاء موقع إلكتروني</Button></Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">موقعي الإلكتروني</h1>
        <div className="flex gap-3">
          <Link href={`/dashboard/website/edit`}><Button variant="outline">تعديل الموقع</Button></Link>
          <a href={`https://${website.subdomain}.wujood.app`} target="_blank"><Button variant="brand">عرض الموقع</Button></a>
        </div>
      </div>
      <WebsitePreview website={website} />
    </div>
  )
}
