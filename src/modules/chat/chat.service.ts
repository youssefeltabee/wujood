const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const SYSTEM_PROMPT = "You are Wujood AI assistant for Egyptian SMEs. You help business owners with website building, SEO, social media, online payments, and digital presence. Respond in Arabic or English based on the user's message. Be concise and practical.";

export async function generateChatResponse(messages: { role: string; content: string }[]) {
  if (!OPENAI_API_KEY) {
    console.error("[Chat] OPENAI_API_KEY not configured");
    return {
      role: "assistant",
      content: "عذراً، خدمة المساعد الذكي غير متاحة حالياً. حاول مرة أخرى لاحقاً. / Sorry, the AI assistant is currently unavailable. Please try again later.",
    };
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
    const errorText = await res.text();
    console.error(`[Chat] OpenAI API error ${res.status}: ${errorText}`);
    return {
      role: "assistant",
      content: "عذراً، خدمة المساعد الذكي غير متاحة حالياً. حاول مرة أخرى لاحقاً. / Sorry, the AI assistant is currently unavailable. Please try again later.",
    };
  }

  const data = await res.json();
  return {
    role: "assistant",
    content: data.choices?.[0]?.message?.content ?? "عذراً، لم أتمكن من فهم الطلب. حاول مرة أخرى من فضلك.",
  };
}
