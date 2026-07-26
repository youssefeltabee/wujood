import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authenticateUser } from "@/lib/auth";
import { scanUrl } from "./audit.scanner";
import { computeScore } from "./audit.scorer";

export async function createAuditController(req: NextRequest) {
  try {
    const auth = await authenticateUser();
    if (auth instanceof NextResponse) return auth;

    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "URL required" }, { status: 400 });
    }

    const scan = await scanUrl(url);
    const score = computeScore(scan);

    const audit = await prisma.audit.create({
      data: {
        userId: auth.userId,
        url,
        totalScore: score.totalScore,
        mobileScore: scan.mobileScore, speedScore: scan.speedScore,
        seoScore: scan.seoScore, contentScore: scan.contentScore,
        socialScore: scan.socialScore, pricingScore: scan.pricingScore,
        paymentScore: scan.paymentScore, aiScore: scan.aiScore,
        trustScore: scan.trustScore, contactScore: scan.contactScore,
        rawData: scan.rawData as any,
      },
    });

    return NextResponse.json({ audit: { id: audit.id, ...score, url } });
  } catch {
    return NextResponse.json({ error: "Audit failed" }, { status: 500 });
  }
}

export async function listAuditsController() {
  try {
    const auth = await authenticateUser();
    if (auth instanceof NextResponse) return auth;

    const audits = await prisma.audit.findMany({
      where: { userId: auth.userId, deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: { id: true, url: true, totalScore: true, createdAt: true },
    });

    return NextResponse.json(
      { audits },
      { headers: { "Cache-Control": "private, max-age=30, stale-while-revalidate=60" } }
    );
  } catch {
    return NextResponse.json({ error: "Failed to fetch audits" }, { status: 500 });
  }
}

export async function getAuditController(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await authenticateUser();
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;
    const audit = await prisma.audit.findFirst({
      where: { id, userId: auth.userId, deletedAt: null },
      select: {
        id: true, url: true, totalScore: true, createdAt: true,
        mobileScore: true, speedScore: true, seoScore: true,
        contentScore: true, socialScore: true, pricingScore: true,
        paymentScore: true, aiScore: true, trustScore: true, contactScore: true,
      },
    });

    if (!audit) {
      return NextResponse.json({ error: "Audit not found" }, { status: 404 });
    }

    return NextResponse.json(
      { audit },
      { headers: { "Cache-Control": "private, max-age=60, stale-while-revalidate=120" } }
    );
  } catch {
    return NextResponse.json({ error: "Failed to fetch audit" }, { status: 500 });
  }
}

export async function pdfAuditController(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await authenticateUser();
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;
    const audit = await prisma.audit.findFirst({
      where: { id, userId: auth.userId, deletedAt: null },
    });
    if (!audit) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const score = computeScore({
      mobileScore: audit.mobileScore, speedScore: audit.speedScore,
      seoScore: audit.seoScore, contentScore: audit.contentScore,
      socialScore: audit.socialScore, pricingScore: audit.pricingScore,
      paymentScore: audit.paymentScore, aiScore: audit.aiScore,
      trustScore: audit.trustScore, contactScore: audit.contactScore,
      rawData: (audit.rawData as Record<string, unknown>) || {},
    });

    const { generatePdf } = await import("./audit.report");
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
