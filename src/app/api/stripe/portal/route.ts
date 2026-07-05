import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { createCustomerPortalSession } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })

  const sub = await prisma.subscription.findUnique({ where: { userId: user.id } })
  if (!sub?.stripeCustomerId) return NextResponse.json({ error: "لا يوجد اشتراك نشط" }, { status: 400 })

  const portal = await createCustomerPortalSession(sub.stripeCustomerId, `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/subscription`)
  return NextResponse.redirect(portal.url)
}
