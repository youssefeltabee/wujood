import { NextResponse } from "next/server";
import { Receiver } from "@upstash/qstash";
import { prisma } from "@/lib/db";

const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_SIGNING_KEY!,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
});

// Vercel Cron sends `Authorization: Bearer <CRON_SECRET>` instead of a QStash signature.
function isCronAuthorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  return !!secret && req.headers.get("authorization") === `Bearer ${secret}`;
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("upstash-signature") ?? "";

  try {
    await receiver.verify({ signature, body, url: req.url });
  } catch {
    if (!isCronAuthorized(req)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  const now = new Date();
  const [tokens, subscriptions] = await Promise.all([
    prisma.refreshToken.deleteMany({ where: { expiresAt: { lt: now } } }),
    prisma.subscription.updateMany({
      where: { status: "ACTIVE", expiresAt: { lt: now } },
      data: { status: "EXPIRED" },
    }),
  ]);

  return NextResponse.json({
    success: true,
    refreshTokensDeleted: tokens.count,
    subscriptionsExpired: subscriptions.count,
  });
}
