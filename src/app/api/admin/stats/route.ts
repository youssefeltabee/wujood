import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authenticateUser } from "@/lib/auth";
import { ForbiddenError, handleApiError } from "@/lib/errors";

export async function GET() {
  try {
    const user = await authenticateUser();

    const dbUser = await prisma.user.findUnique({ where: { id: user.userId }, select: { role: true } });
    if (!dbUser || dbUser.role !== "ADMIN") throw new ForbiddenError();

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
