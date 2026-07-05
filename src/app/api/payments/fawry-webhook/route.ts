import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { merchantRefNum, paymentStatus, signature } = body
    if (!merchantRefNum) return NextResponse.json({ error: "Missing ref" }, { status: 400 })

    if (paymentStatus === "PAID" || paymentStatus === "success") {
      await prisma.subscription.updateMany({ where: { fawryRefNum: merchantRefNum }, data: { status: "active" } })
    }

    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: "Webhook error" }, { status: 500 }) }
}
