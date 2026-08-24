import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authenticateUser } from "@/lib/auth";
import { handleApiError } from "@/lib/errors";
import { assertTierPayment } from "@/modules/payments/payments.gate";
import { siteConfig } from "@/config/site";

const VALID_TIERS = siteConfig.tiers.map(t => t.id);

export async function GET() {
  try {
    const user = await authenticateUser();

    const subscription = await prisma.subscription.findFirst({
      where: { userId: user.userId },
      orderBy: { startedAt: "desc" },
    });

    return NextResponse.json({ subscription });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await authenticateUser();

    const body = await req.json();
    const { action } = body;

    if (action === "cancel") {
      const sub = await prisma.subscription.findFirst({
        where: { userId: user.userId, status: "active" },
      });
      if (!sub) return NextResponse.json({ error: "No active subscription" }, { status: 404 });

      const updated = await prisma.subscription.update({
        where: { id: sub.id },
        data: { status: "canceled", canceledAt: new Date() },
      });

      return NextResponse.json({ subscription: updated });
    }

    if (action === "change-tier") {
      const { tier } = body;
      if (!tier || !VALID_TIERS.includes(tier)) {
        return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
      }

      const payments = await prisma.payment.findMany({
        where: { userId: user.userId },
        orderBy: { createdAt: "desc" },
      });
      if (!assertTierPayment(payments, tier).ok) {
        return NextResponse.json({ error: "payment_required" }, { status: 402 });
      }

      const current = await prisma.subscription.findFirst({
        where: { userId: user.userId, status: "active" },
      });

      if (current) {
        await prisma.subscription.update({
          where: { id: current.id },
          data: { status: "canceled", canceledAt: new Date() },
        });
      }

      const tierConfig = siteConfig.tiers.find(t => t.id === tier);
      const priceEgp = tierConfig?.price ?? 0;

      const newSub = await prisma.subscription.create({
        data: {
          userId: user.userId,
          tier,
          priceEgp,
          expiresAt: new Date(Date.now() + 30 * 86400000),
        },
      });

      return NextResponse.json({ subscription: newSub });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    return handleApiError(err);
  }
}
