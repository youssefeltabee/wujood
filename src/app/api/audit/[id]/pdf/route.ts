import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { computeScore } from "@/lib/audit/scorer";
import { generatePdf } from "@/lib/audit/report";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const audit = await prisma.audit.findUnique({ where: { id: BigInt(id) } });
    if (!audit) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const score = computeScore({
      mobileScore: audit.mobileScore, speedScore: audit.speedScore,
      seoScore: audit.seoScore, contentScore: audit.contentScore,
      socialScore: audit.socialScore, pricingScore: audit.pricingScore,
      paymentScore: audit.paymentScore, aiScore: audit.aiScore,
      trustScore: audit.trustScore, contactScore: audit.contactScore,
      rawData: (audit.rawData as Record<string, unknown>) || {},
    });
    const pdfBlob = await generatePdf(audit.url, score);
    return new NextResponse(pdfBlob, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="ghost-audit-${audit.id}.pdf"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "PDF generation failed" }, { status: 500 });
  }
}
