const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const MOCK_RESPONSES = [
  "أهلاً بك! كيف يمكنني مساعدتك في تطوير أعمالك اليوم؟",
  "مرحباً! يمكنني مساعدتك في إنشاء موقع إلكتروني متكامل لنشاطك التجاري.",
  "Hello! I can help you with your business website, social media, and online presence.",
  "نعم، يمكننا تحسين ظهورك على محركات البحث وزيادة مبيعاتك.",
  "Absolutely! We offer website building, SEO, social media management, and AI chatbot services.",
  "هل لديك أي استفسارات حول الخدمات التي نقدمها؟",
  "Sure! You can start by running a free audit of your current website to see where you can improve.",
];

const SYSTEM_PROMPT = "You are Wujood AI assistant for Egyptian SMEs. You help business owners with website building, SEO, social media, online payments, and digital presence. Respond in Arabic or English based on the user's message. Be concise and practical.";

export async function generateChatResponse(messages: { role: string; content: string }[]) {
  if (!OPENAI_API_KEY) {
    const randomMock = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
    return { role: "assistant", content: randomMock };
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      max_tokens: 500,
    }),
  });

  if (!res.ok) {
    const mock = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
    return { role: "assistant", content: mock };
  }

  const data = await res.json();
  return {
    role: "assistant",
    content: data.choices?.[0]?.message?.content ?? MOCK_RESPONSES[0],
  };
}
