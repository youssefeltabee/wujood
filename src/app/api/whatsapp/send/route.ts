import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/modules/auth/auth.service";

export async function POST(req: NextRequest) {
  try {
    const token = (await cookies()).get("token")?.value;
    const user = token ? verifyAccessToken(token) : null;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { to, message, templateName } = await req.json();
    if (!to || !message) {
      return NextResponse.json({ error: "to and message required" }, { status: 400 });
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;

    if (accountSid && authToken && fromNumber) {
      // @ts-expect-error - optional dep, only loaded when env vars configured
      const twilio = await import("twilio");
      const client = twilio.default(accountSid, authToken);
      const twilioMsg = await client.messages.create({
        from: `whatsapp:${fromNumber}`,
        to: `whatsapp:${to}`,
        body: message,
      });
      return NextResponse.json({ success: true, messageId: twilioMsg.sid });
    }

    console.log(`[WhatsApp Mock] To: ${to} | Template: ${templateName || "none"} | Message: ${message}`);
    return NextResponse.json({ success: true, messageId: "mock_" + Date.now(), mockMode: true });
  } catch {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
