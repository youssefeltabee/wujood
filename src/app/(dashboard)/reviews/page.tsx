import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function ReviewsPage() {
  const user = await getSession()
  if (!user) redirect("/login")
  const reviews = await prisma.review.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">التقييمات</h1>
      {reviews.length === 0 ? (
        <Card><p className="text-gray-500 text-center py-8">لا توجد تقييمات بعد</p></Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <Card key={r.id}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{r.reviewerName}</span>
                <Badge variant={r.rating >= 4 ? "success" : r.rating >= 3 ? "warning" : "danger"}>{r.rating}/5</Badge>
              </div>
              <p className="text-gray-700">{r.content}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
