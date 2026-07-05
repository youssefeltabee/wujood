import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function GET() {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  const items = await prisma.catalogItem.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } })
  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  try {
    const { name, description, price, imageUrl, category } = await req.json()
    const item = await prisma.catalogItem.create({ data: { userId: user.id, name, description, price: Number(price), imageUrl, category } })
    return NextResponse.json(item)
  } catch { return NextResponse.json({ error: "فشل إنشاء المنتج" }, { status: 500 }) }
}
