import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { authenticateUser } from "@/lib/auth";
import { handleApiError, NotFoundError, ValidationError, RateLimitError } from "@/lib/errors";
import { validateBody, idSchema } from "@/lib/validate";
import { jsonOk, jsonPaginated, jsonAccepted } from "@/utils/api";
import { computeScore } from "./audit.scorer";
import { rateLimit } from "@/lib/rate-limit";
import { enqueueJob } from "@/lib/queue";

const createAuditSchema = z.object({
  url: z.string().url("Must be a valid URL"),
});

export async function createAuditController(req: NextRequest) {
  try {
    const user = await authenticateUser();

    const { success } = await rateLimit(`audit:${user.userId}`, 10);
    if (!success) throw new RateLimitError("Too many audit requests. Try again later.");

    const result = await validateBody(req, createAuditSchema);
    if ("error" in result) return handleApiError(result.error);
    const { url } = result.data;

    const audit = await prisma.audit.create({
      data: { userId: user.userId, url, status: "PENDING" },
    });

    await enqueueJob("audit-scan", { auditId: audit.id, url });

    return jsonAccepted({ id: audit.id, status: "PENDING" }, "Audit scan queued");
  } catch (err) {
    return handleApiError(err);
  }
}

export async function listAuditsController(req: NextRequest) {
  try {
    const user = await authenticateUser();

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") ?? "20", 10)));

    const [audits, total] = await Promise.all([
      prisma.audit.findMany({
        where: { userId: user.userId, deletedAt: null },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: { id: true, url: true, totalScore: true, createdAt: true },
      }),
      prisma.audit.count({ where: { userId: user.userId, deletedAt: null } }),
    ]);

    return jsonPaginated(audits, total, page, pageSize);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function getAuditController(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await authenticateUser();

    const { id } = await params;
    if (!idSchema.safeParse(id).success) {
      throw new ValidationError("Invalid audit ID");
    }

    const audit = await prisma.audit.findFirst({
      where: { id, userId: user.userId, deletedAt: null },
      select: {
        id: true, url: true, totalScore: true, createdAt: true,
        mobileScore: true, speedScore: true, seoScore: true,
        contentScore: true, socialScore: true, pricingScore: true,
        paymentScore: true, aiScore: true, trustScore: true, contactScore: true,
        preLaunchScore: true,
      },
    });

    if (!audit) {
      throw new NotFoundError("Audit");
    }

    const response = jsonOk({ audit });
    response.headers.set("Cache-Control", "private, max-age=60, stale-while-revalidate=120");
    return response;
  } catch (err) {
    return handleApiError(err);
  }
}

export async function auditStatusController(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await authenticateUser();

    const { id } = await params;
    if (!idSchema.safeParse(id).success) {
      throw new ValidationError("Invalid audit ID");
    }

    const audit = await prisma.audit.findFirst({
      where: { id, userId: user.userId, deletedAt: null },
      select: {
        id: true, status: true, error: true, totalScore: true,
        mobileScore: true, speedScore: true, seoScore: true,
        contentScore: true, socialScore: true, pricingScore: true,
        paymentScore: true, aiScore: true, trustScore: true, contactScore: true,
        preLaunchScore: true,
        rawData: true,
      },
    });

    if (!audit) {
      throw new NotFoundError("Audit");
    }

    if (audit.status === "COMPLETED") {
      return jsonOk({
        id: audit.id,
        status: audit.status,
        results: {
          totalScore: audit.totalScore,
          mobileScore: audit.mobileScore, speedScore: audit.speedScore,
          seoScore: audit.seoScore, contentScore: audit.contentScore,
          socialScore: audit.socialScore, pricingScore: audit.pricingScore,
          paymentScore: audit.paymentScore, aiScore: audit.aiScore,
          trustScore: audit.trustScore, contactScore: audit.contactScore,
          preLaunchScore: audit.preLaunchScore,
          rawData: audit.rawData,
        },
      });
    }

    if (audit.status === "FAILED") {
      return jsonOk({ id: audit.id, status: audit.status, error: audit.error });
    }

    return jsonOk({ id: audit.id, status: audit.status });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function pdfAuditController(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await authenticateUser();

    const { id } = await params;
    if (!idSchema.safeParse(id).success) {
      throw new ValidationError("Invalid audit ID");
    }

    const audit = await prisma.audit.findFirst({
      where: { id, userId: user.userId, deletedAt: null },
    });
    if (!audit) throw new NotFoundError("Audit");

    const score = computeScore({
      mobileScore: audit.mobileScore, speedScore: audit.speedScore,
      seoScore: audit.seoScore, contentScore: audit.contentScore,
      socialScore: audit.socialScore, pricingScore: audit.pricingScore,
      paymentScore: audit.paymentScore, aiScore: audit.aiScore,
      trustScore: audit.trustScore, contactScore: audit.contactScore,
      preLaunchScore: audit.preLaunchScore,
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
  } catch (err) {
    return handleApiError(err);
  }
}
