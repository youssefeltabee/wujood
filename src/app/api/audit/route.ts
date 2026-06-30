import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { scanUrl } from "@/lib/audit/scanner";
import { computeScore } from "@/lib/audit/scorer";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "URL required" }, { status: 400 });
    }

    const user = await requireAuth();
    const scan = await scanUrl(url);
    const score = computeScore(scan);

    const audit = await prisma.audit.create({
      data: {
        userId: user?.userId ? Number(user.userId) : null,
        url,
        totalScore: score.totalScore,
        mobileScore: scan.mobileScore,
        speedScore: scan.speedScore,
        seoScore: scan.seoScore,
        contentScore: scan.contentScore,
        socialScore: scan.socialScore,
        pricingScore: scan.pricingScore,
        paymentScore: scan.paymentScore,
        aiScore: scan.aiScore,
        trustScore: scan.trustScore,
        contactScore: scan.contactScore,
        rawData: scan.rawData as any,
      },
    });

    return NextResponse.json({ audit: { id: Number(audit.id), ...score, url } });
  } catch {
    return NextResponse.json({ error: "Audit failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const user = await requireAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const audits = await prisma.audit.findMany({
    where: { userId: Number(user.userId) },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  const serialized = audits.map((a) => ({ ...a, id: Number(a.id) }));
  return NextResponse.json({ audits: serialized });
}
