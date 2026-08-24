import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/modules/auth/auth.service";
import { rateLimit } from "@/lib/rate-limit";
import { handleApiError } from "@/lib/errors";

const E164 = /^\+[1-9]\d{7,14}$/;

export async function POST(req: NextRequest) {
  try {
    const token = (await cookies()).get("token")?.value;
    const payload = token ? await verifyAccessToken(token) : null;
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = { userId: payload.userId };

    const rl = await rateLimit(`wa:${user.userId}`, { interval: 3_600_000, maxRequests: 50 });
    if (!rl.success) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    const { to, message, templateName } = await req.json();
    if (!to || !message) {
      return NextResponse.json({ error: "to and message required" }, { status: 400 });
    }
    if (typeof to !== "string" || !E164.test(to)) {
      return NextResponse.json({ error: "to must be E.164 format" }, { status: 400 });
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;

    // ponytail: mock only when WA_MOCK==="true"; otherwise Twilio is the real path
    if (process.env.WA_MOCK !== "true") {
      const twilio = await import("twilio");
      const client = twilio.default(accountSid!, authToken!);
      const twilioMsg = await client.messages.create({
        from: `whatsapp:${fromNumber}`,
        to: `whatsapp:${to}`,
        body: message,
      });
      return NextResponse.json({ success: true, messageId: twilioMsg.sid });
    }

    console.log(`[WhatsApp Mock] To: ${to} | Template: ${templateName || "none"} | Message: ${message}`);
    return NextResponse.json({ success: true, messageId: "mock_" + Date.now(), mockMode: true });
  } catch (err) {
    return handleApiError(err);
  }
}
