import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { createCheckoutSession, PLANS } from "@/lib/stripe"

export async function POST(req: NextRequest) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  try {
    const { planKey } = await req.json()
    if (!planKey || !(planKey in PLANS)) return NextResponse.json({ error: "باقة غير صالحة" }, { status: 400 })

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const session = await createCheckoutSession(user.id, planKey as any, `${baseUrl}/dashboard/subscription?success=true`, `${baseUrl}/pricing?canceled=true`)

    return NextResponse.json({ url: session.url })
  } catch { return NextResponse.json({ error: "فشل إنشاء جلسة الدفع" }, { status: 500 }) }
}
