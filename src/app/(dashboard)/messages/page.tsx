import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card } from "@/components/ui/card"

export default async function MessagesPage() {
  const user = await getSession()
  if (!user) redirect("/login")
  const conversations = await prisma.conversation.findMany({ where: { userId: user.id }, include: { messages: { take: 1, orderBy: { createdAt: "desc" } } }, orderBy: { updatedAt: "desc" } })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">الرسائل</h1>
      {conversations.length === 0 ? (
        <Card><p className="text-gray-500 text-center py-8">لا توجد محادثات بعد</p></Card>
      ) : (
        <div className="space-y-3">
          {conversations.map((conv) => (
            <Card key={conv.id} className="flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow">
              <div><p className="font-medium text-gray-900">{conv.contactName || "غير معروف"}</p><p className="text-sm text-gray-500">{conv.messages[0]?.content?.slice(0, 80)}...</p></div>
              <span className="text-xs text-gray-400">{conv.updatedAt.toLocaleDateString("ar-EG")}</span>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
