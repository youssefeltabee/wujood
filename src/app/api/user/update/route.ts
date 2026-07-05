import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function PUT(req: NextRequest) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  try {
    const { name, phone } = await req.json()
    const updated = await prisma.user.update({ where: { id: user.id }, data: { name, phone } })
    return NextResponse.json({ user: { id: updated.id, name: updated.name, email: updated.email, phone: updated.phone } })
  } catch { return NextResponse.json({ error: "فشل تحديث البيانات" }, { status: 500 }) }
}
