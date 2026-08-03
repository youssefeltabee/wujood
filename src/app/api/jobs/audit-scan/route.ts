import { NextResponse } from "next/server";
import { Receiver } from "@upstash/qstash";
import { prisma } from "@/lib/db";
import { scanUrl } from "@/modules/audit/audit.scanner";
import { computeScore } from "@/modules/audit/audit.scorer";
import { enqueueJob } from "@/lib/queue";

const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_SIGNING_KEY!,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("upstash-signature") ?? "";

  try {
    await receiver.verify({
      signature,
      body,
      url: req.url,
    });
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const { auditId, url } = JSON.parse(body) as { auditId: string; url: string };

  try {
    const scan = await scanUrl(url);
    const score = computeScore(scan);

    await prisma.audit.update({
      where: { id: auditId },
      data: {
        status: "COMPLETED",
        totalScore: score.totalScore,
        mobileScore: score.categories.mobileScore,
        speedScore: score.categories.speedScore,
        seoScore: score.categories.seoScore,
        contentScore: score.categories.contentScore,
        socialScore: score.categories.socialScore,
        pricingScore: score.categories.pricingScore,
        paymentScore: score.categories.paymentScore,
        aiScore: score.categories.aiScore,
        trustScore: score.categories.trustScore,
        contactScore: score.categories.contactScore,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rawData: scan.rawData as any,
      },
    });

    await enqueueJob("pdf-generation", { auditId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    await prisma.audit.update({
      where: { id: auditId },
      data: { status: "FAILED", error: message },
    });
  }

  return NextResponse.json({ success: true });
}
