import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { verifyAccessToken } from "@/modules/auth/auth.service";

async function getUser(req: NextRequest) {
  const token = (await cookies()).get("token")?.value;
  const user = token ? verifyAccessToken(token) : null;
  if (!user) return null;
  return user;
}

export async function GET(req: NextRequest) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const subscription = await prisma.subscription.findFirst({
    where: { userId: user.userId },
    orderBy: { startedAt: "desc" },
  });

  return NextResponse.json({ subscription });
}

export async function POST(req: NextRequest) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
    if (!tier || !["kashif", "mutamayiz"].includes(tier)) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
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

    const newSub = await prisma.subscription.create({
      data: {
        userId: user.userId,
        tier,
        priceEgp: tier === "mutamayiz" ? 999 : 0,
        expiresAt: new Date(Date.now() + 30 * 86400000),
      },
    });

    return NextResponse.json({ subscription: newSub });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
