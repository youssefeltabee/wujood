import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/modules/admin/admin.guard";
import { handleApiError } from "@/lib/errors";

export async function GET() {
  try {
    await requireAdmin();

    const [totalUsers, totalPayments, revenueAgg, activeSubscriptions, totalAudits] = await Promise.all([
      prisma.user.count(),
      prisma.payment.count(),
      prisma.payment.aggregate({ _sum: { amount: true }, where: { status: "COMPLETED" } }),
      prisma.subscription.count({ where: { status: "ACTIVE" } }),
      prisma.audit.count(),
    ]);

    return NextResponse.json({
      totalUsers,
      totalPayments,
      totalRevenue: revenueAgg._sum.amount ?? 0,
      activeSubscriptions,
      totalAudits,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
