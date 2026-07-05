import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function GET() {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  const website = await prisma.website.findFirst({ where: { userId: user.id }, include: { pages: true, template: true } })
  return NextResponse.json(website)
}

export async function POST(req: NextRequest) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  try {
    const { businessName, description, subdomain, templateId, structure } = await req.json()
    const existing = await prisma.website.findFirst({ where: { userId: user.id } })
    if (existing) return NextResponse.json({ error: "لديك موقع بالفعل" }, { status: 409 })

    if (subdomain) {
      const taken = await prisma.website.findUnique({ where: { subdomain } })
      if (taken) return NextResponse.json({ error: "المجال الفرعي مستخدم بالفعل" }, { status: 409 })
    }

    const website = await prisma.website.create({
      data: { userId: user.id, businessName, description, subdomain: subdomain || user.id.slice(0, 8), structure, templateId },
    })
    return NextResponse.json(website)
  } catch { return NextResponse.json({ error: "فشل إنشاء الموقع" }, { status: 500 }) }
}
