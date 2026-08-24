import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/modules/admin/admin.guard";
import { handleApiError } from "@/lib/errors";

export async function GET() {
  try {
    await requireAdmin();

    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, companyName: true, role: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ users });
  } catch (err) {
    return handleApiError(err);
  }
}
