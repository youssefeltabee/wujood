import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { StatsCard } from "@/components/dashboard/stats-card"

export default async function DashboardPage() {
  const user = await getSession()
  if (!user) redirect("/login")

  const [websites, messages, contacts] = await Promise.all([
    prisma.website.count({ where: { userId: user.id } }),
    prisma.conversation.count({ where: { userId: user.id } }),
    prisma.contact.count({ where: { userId: user.id } }),
  ])

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">مرحباً، {user.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard title="المواقع الإلكترونية" value={websites} />
        <StatsCard title="المحادثات النشطة" value={messages} />
        <StatsCard title="جهات الاتصال" value={contacts} />
      </div>
    </div>
  )
}
