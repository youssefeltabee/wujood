import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { generateContent } from "@/lib/ai"

export async function POST(req: NextRequest) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  try {
    const { prompt, type } = await req.json()
    if (!prompt) return NextResponse.json({ error: "النص المطلوب مطلوب" }, { status: 400 })
    const content = await generateContent(prompt, type || "social")
    return NextResponse.json({ content })
  } catch { return NextResponse.json({ error: "فشل إنشاء المحتوى" }, { status: 500 }) }
}
