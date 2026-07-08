import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { verifyAccessToken } from "@/modules/auth/auth.service";
import { scanUrl } from "./audit.scanner";
import { computeScore } from "./audit.scorer";

export async function createAuditController(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "URL required" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const user = token ? verifyAccessToken(token) : null;

    const scan = await scanUrl(url);
    const score = computeScore(scan);

    const audit = await prisma.audit.create({
      data: {
        userId: user?.userId || null,
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
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const user = token ? verifyAccessToken(token) : null;
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const audits = await prisma.audit.findMany({
      where: { userId: user.userId, deletedAt: null },
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
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const user = token ? verifyAccessToken(token) : null;
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const audit = await prisma.audit.findFirst({
      where: { id, deletedAt: null },
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
    const { id } = await params;
    const audit = await prisma.audit.findUnique({ where: { id } });
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
