import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" })

export interface ChatMessage { role: "user" | "assistant" | "system"; content: string }

export async function chatCompletion(messages: ChatMessage[]) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "system", content: "أنت مساعد Wujood الذكي. تساعد أصحاب الشركات المصرية الصغيرة في تحسين الحضور الرقمي وإنشاء محتوى تسويقي. كن ودوداً ومفيداً. أجب باللغة العربية الفصحى البسيطة." }, ...messages],
    max_tokens: 1024, temperature: 0.7,
  })
  return response.choices[0]?.message?.content || ""
}

export async function generateContent(prompt: string, type: "social" | "website" | "email" | "product") {
  const typeInstructions: Record<string, string> = {
    social: "أنشئ منشورًا قصيرًا وجذابًا مناسبًا لوسائل التواصل الاجتماعي.",
    website: "أنشئ نصًا تسويقيًا احترافيًا لموقع إلكتروني.",
    email: "أنشئ بريدًا إلكترونيًا تسويقيًا احترافيًا باللغة العربية.",
    product: "أنشئ وصفًا مقنعًا لمنتج أو خدمة مع مميزاته وفوائده.",
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "system", content: `أنت كاتب محتوى تسويقي محترف للشركات المصرية. ${typeInstructions[type] || typeInstructions.social}` }, { role: "user", content: prompt }],
    max_tokens: 1024, temperature: 0.8,
  })
  return response.choices[0]?.message?.content || ""
}

export async function analyzeAudit(results: Record<string, any>) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "system", content: "أنت خبير تحليل مواقع إلكترونية. حلل نتائج التدقيق وقدم ملخص تنفيذي وأهم 3 مشاكل و3 توصيات قابلة للتنفيذ." }, { role: "user", content: JSON.stringify(results) }],
    max_tokens: 1500, temperature: 0.5,
  })
  return response.choices[0]?.message?.content || ""
}
