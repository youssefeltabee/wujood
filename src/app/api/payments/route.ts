import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { createFawryPaymentLink } from "@/lib/payments"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

export async function POST(req: NextRequest) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  try {
    const { planKey } = await req.json()
    if (!planKey) return NextResponse.json({ error: "الباقة مطلوبة" }, { status: 400 })

    const refNum = `WJ-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`
    const result = await createFawryPaymentLink(refNum, planKey === "kashif" ? 1250 : planKey === "sane" ? 2500 : 4500, { name: user.name, mobile: user.phone || "", email: user.email }, [{ id: planKey, desc: `باقة ${planKey}`, price: planKey === "kashif" ? 1250 : planKey === "sane" ? 2500 : 4500 }])

    await prisma.subscription.upsert({
      where: { userId: user.id },
      update: { status: "pending", planKey, fawryRefNum: refNum },
      create: { userId: user.id, status: "pending", planKey, fawryRefNum: refNum },
    })

    return NextResponse.json({ paymentUrl: result?.paymentUrl || result?.redirectUrl, refNum })
  } catch { return NextResponse.json({ error: "فشل إنشاء الدفع" }, { status: 500 }) }
}
