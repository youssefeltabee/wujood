import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature") || ""
  const body = await req.text()
  let event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET || "")
  } catch { return NextResponse.json({ error: "Invalid signature" }, { status: 400 }) }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object
      const userId = session.client_reference_id
      const planKey = session.metadata?.planKey
      if (userId && planKey) {
        await prisma.subscription.upsert({
          where: { userId },
          update: { status: "active", planKey, stripeSubscriptionId: session.subscription as string, stripeCustomerId: session.customer as string },
          create: { userId, status: "active", planKey, stripeSubscriptionId: session.subscription as string, stripeCustomerId: session.customer as string },
        })
      }
      break
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object
      await prisma.subscription.updateMany({ where: { stripeSubscriptionId: sub.id }, data: { status: "canceled" } })
      break
    }
  }

  return NextResponse.json({ received: true })
}
