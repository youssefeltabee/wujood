import { NextRequest, NextResponse } from "next/server"
import { runAudit } from "@/lib/audit"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()
    if (!url) return NextResponse.json({ error: "الرابط مطلوب" }, { status: 400 })

    const result = await runAudit(url)
    await prisma.audit.create({ data: { url, score: result.score, results: result, userId: null } })

    return NextResponse.json(result)
  } catch (error) { return NextResponse.json({ error: "فشل التدقيق" }, { status: 500 }) }
}
