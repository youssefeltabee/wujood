import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const { websiteId, reviewerName, rating, content } = await req.json()
    if (!websiteId || !reviewerName || !rating || !content) return NextResponse.json({ error: "جميع الحقول مطلوبة" }, { status: 400 })

    const website = await prisma.website.findUnique({ where: { id: websiteId } })
    if (!website) return NextResponse.json({ error: "الموقع غير موجود" }, { status: 404 })

    const review = await prisma.review.create({ data: { websiteId, userId: website.userId, reviewerName, rating: Number(rating), content } })
    return NextResponse.json(review)
  } catch { return NextResponse.json({ error: "فشل إنشاء التقييم" }, { status: 500 }) }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const websiteId = searchParams.get("websiteId")
    const reviews = websiteId ? await prisma.review.findMany({ where: { websiteId }, orderBy: { createdAt: "desc" } }) : []
    return NextResponse.json(reviews)
  } catch { return NextResponse.json({ error: "فشل جلب التقييمات" }, { status: 500 }) }
}
