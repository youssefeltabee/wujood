import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { chatCompletion } from "@/lib/ai"

export async function POST(req: NextRequest) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  try {
    const { messages } = await req.json()
    if (!messages || !Array.isArray(messages)) return NextResponse.json({ error: "الرسائل مطلوبة" }, { status: 400 })
    const response = await chatCompletion(messages)
    return NextResponse.json({ response })
  } catch { return NextResponse.json({ error: "فشل الاتصال بالمساعد الذكي" }, { status: 500 }) }
}
