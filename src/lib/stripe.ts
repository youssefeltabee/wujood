import Stripe from "stripe"

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return null
  return new Stripe(key, {
    apiVersion: "2025-09-30" as Stripe.LatestApiVersion,
    typescript: true,
  })
}

export const PLANS = {
  kashif: { priceId: process.env.STRIPE_KASHIF_PRICE_ID || "", name: "كاشف", nameEn: "Kashif", amount: 1250, features: ["موقع إلكتروني متكامل", "تدقيق الشبح الرقمي", "ردود تلقائية واتساب", "مجال فرعي مجاني"] },
  sane: { priceId: process.env.STRIPE_SANE_PRICE_ID || "", name: "صانع", nameEn: "Sane", amount: 2500, features: ["كل مزايا كاشف", "إدارة التواصل الاجتماعي", "كتالوج منتجات", "نظام التقييمات", "تحليلات أساسية"] },
  raed: { priceId: process.env.STRIPE_RAED_PRICE_ID || "", name: "رائد", nameEn: "Raed", amount: 4500, features: ["كل مزايا صانع", "مساعد ذكي (AI Chatbot)", "متجر إلكتروني بسيط", "تحليلات متقدمة", "دعم أولوية"] },
} as const

export type PlanKey = keyof typeof PLANS

export async function createCheckoutSession(userId: string, planKey: PlanKey, successUrl: string, cancelUrl: string) {
  const stripe = getStripe()
  if (!stripe) throw new Error("Stripe not configured")
  const plan = PLANS[planKey]
  const session = await stripe.checkout.sessions.create({
    mode: "subscription", payment_method_types: ["card"],
    line_items: [{ price: plan.priceId, quantity: 1 }],
    client_reference_id: userId,
    metadata: { planKey },
    subscription_data: { metadata: { userId, planKey } },
    success_url: successUrl, cancel_url: cancelUrl, locale: "ar",
  })
  return session
}

export async function createCustomerPortalSession(customerId: string, returnUrl: string) {
  const stripe = getStripe()
  if (!stripe) throw new Error("Stripe not configured")
  return stripe.billingPortal.sessions.create({ customer: customerId, return_url: returnUrl })
}
