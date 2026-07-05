import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  try {
    const { id } = await params
    const data = await req.json()
    const website = await prisma.website.update({ where: { id, userId: user.id }, data })
    return NextResponse.json(website)
  } catch { return NextResponse.json({ error: "فشل تحديث الموقع" }, { status: 500 }) }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  try {
    const { id } = await params
    await prisma.website.delete({ where: { id, userId: user.id } })
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: "فشل حذف الموقع" }, { status: 500 }) }
}
