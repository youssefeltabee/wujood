import axios from "axios"

const WHATSAPP_API_VERSION = "v22.0"
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || ""
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || ""

const api = axios.create({
  baseURL: `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${PHONE_NUMBER_ID}`,
  headers: { Authorization: `Bearer ${ACCESS_TOKEN}`, "Content-Type": "application/json" },
})

export interface WhatsAppMessage { to: string; type: "text" | "template" | "catalog"; content: string; templateName?: string; templateParams?: string[] }

export async function sendTextMessage(to: string, text: string) {
  return api.post("/messages", {
    messaging_product: "whatsapp", recipient_type: "individual",
    to: to.replace(/^\+?0*/, ""), type: "text",
    text: { preview_url: false, body: text },
  })
}

export async function sendTemplateMessage(to: string, templateName: string, params: string[]) {
  return api.post("/messages", {
    messaging_product: "whatsapp", recipient_type: "individual",
    to: to.replace(/^\+?0*/, ""), type: "template",
    template: { name: templateName, language: { code: "ar" }, components: [{ type: "body", parameters: params.map((p) => ({ type: "text", text: p })) }] },
  })
}

export async function sendAuditReport(to: string, score: number, url: string) {
  const message = `*نتيجة تدقيق Wujood* 🎯\n\nالموقع: ${url}\nالدرجة: ${score}/100\n\nللمزيد من التفاصيل، تفضل بزيارة: https://wujood.app/audit\nتواصل معنا لتحسين حضورك الرقمي!`
  return sendTextMessage(to, message)
}

export async function handleIncomingMessage(payload: any) {
  const entry = payload?.entry?.[0]
  const change = entry?.changes?.[0]
  const message = change?.value?.messages?.[0]
  if (!message) return null
  return { waMsgId: message.id, from: message.from, text: message.text?.body || "", timestamp: message.timestamp, type: message.type }
}
