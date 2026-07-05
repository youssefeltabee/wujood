import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyFawryPayment } from "@/lib/payments"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const refNum = searchParams.get("merchantRefNum")
  const status = searchParams.get("status")

  if (refNum && status === "success") {
    await prisma.subscription.updateMany({ where: { fawryRefNum: refNum }, data: { status: "active" } })
  }

  return NextResponse.redirect(new URL("/dashboard/subscription", req.url))
}
