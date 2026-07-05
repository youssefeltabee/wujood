import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function POST(req: NextRequest) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  try {
    const { platform, accessToken, accountName, accountId } = await req.json()
    const account = await prisma.socialAccount.create({ data: { userId: user.id, platform, accessToken, accountName, accountId, connected: true } })
    return NextResponse.json(account)
  } catch { return NextResponse.json({ error: "فشل ربط الحساب" }, { status: 500 }) }
}
