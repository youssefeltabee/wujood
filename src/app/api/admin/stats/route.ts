import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { verifyAccessToken } from "@/modules/auth/auth.service";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = verifyAccessToken(token);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: payload.userId }, select: { role: true } });
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const [totalUsers, totalPayments, revenueAgg, activeSubscriptions, totalAudits] = await Promise.all([
    prisma.user.count(),
    prisma.payment.count(),
    prisma.payment.aggregate({ _sum: { amount: true }, where: { status: "completed" } }),
    prisma.subscription.count({ where: { status: "active" } }),
    prisma.audit.count(),
  ]);

  return NextResponse.json({
    totalUsers,
    totalPayments,
    totalRevenue: revenueAgg._sum.amount ?? 0,
    activeSubscriptions,
    totalAudits,
  });
}
