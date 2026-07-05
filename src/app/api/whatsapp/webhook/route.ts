import { NextRequest, NextResponse } from "next/server"
import { handleIncomingMessage, sendTextMessage } from "@/lib/whatsapp"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const mode = searchParams.get("hub.mode")
  const token = searchParams.get("hub.verify_token")
  const challenge = searchParams.get("hub.challenge")

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) return new NextResponse(challenge, { status: 200 })
  return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json()
    const msg = await handleIncomingMessage(payload)
    if (msg) await sendTextMessage(msg.from, `شكراً لتواصلك معنا! رسالتك "${msg.text}" قد استلمناها. سنتواصل معك قريباً.`)
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: "Webhook error" }, { status: 500 }) }
}
