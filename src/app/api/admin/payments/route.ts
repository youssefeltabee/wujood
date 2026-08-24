import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/modules/admin/admin.guard";
import { handleApiError } from "@/lib/errors";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const limit = Math.min(Math.abs(Number(req.nextUrl.searchParams.get("limit")) || 50), 200);

    const payments = await prisma.payment.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { email: true, name: true } } },
    });

    return NextResponse.json({ payments });
  } catch (err) {
    return handleApiError(err);
  }
}
