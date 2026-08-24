import { NextResponse } from "next/server";
import { Receiver } from "@upstash/qstash";
import { prisma } from "@/lib/db";
import { computeScore } from "@/modules/audit/audit.scorer";
import { generatePdf } from "@/modules/audit/audit.report";
import { logger } from "@/lib/logger";

const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_SIGNING_KEY!,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("upstash-signature") ?? "";

  try {
    await receiver.verify({ signature, body, url: req.url });
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const { auditId } = JSON.parse(body) as { auditId: string; userId: string };

  try {
    const audit = await prisma.audit.findUnique({ where: { id: auditId } });
    if (!audit) {
      return NextResponse.json({ error: "Audit not found" }, { status: 404 });
    }

    const score = computeScore({
      mobileScore: audit.mobileScore, speedScore: audit.speedScore,
      seoScore: audit.seoScore, contentScore: audit.contentScore,
      socialScore: audit.socialScore, pricingScore: audit.pricingScore,
      paymentScore: audit.paymentScore, aiScore: audit.aiScore,
      trustScore: audit.trustScore, contactScore: audit.contactScore,
      preLaunchScore: audit.preLaunchScore,
      rawData: (audit.rawData as Record<string, unknown>) || {},
    });

    const pdfBlob = await generatePdf(audit.url, score);
    const buffer = Buffer.from(await pdfBlob.arrayBuffer());
    const pdfUrl = `data:application/pdf;base64,${buffer.toString("base64")}`;

    await prisma.audit.update({
      where: { id: auditId },
      data: { pdfUrl },
    });
  } catch (error) {
    logger.error(`PDF generation failed for audit ${auditId}`, { error: error instanceof Error ? error.message : String(error) });
  }

  return NextResponse.json({ success: true });
}
