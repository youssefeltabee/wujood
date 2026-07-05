import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function GET() {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  const contacts = await prisma.contact.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } })
  return NextResponse.json(contacts)
}

export async function POST(req: NextRequest) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  try {
    const { name, phone, email, notes } = await req.json()
    const contact = await prisma.contact.create({ data: { userId: user.id, name, phone, email, notes } })
    return NextResponse.json(contact)
  } catch { return NextResponse.json({ error: "فشل إنشاء جهة الاتصال" }, { status: 500 }) }
}
