import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { verifyAccessToken } from "@/modules/auth/auth.service";

export async function POST(req: NextRequest) {
  try {
    const token = (await cookies()).get("token")?.value;
    const user = token ? verifyAccessToken(token) : null;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { websiteId, slug, title, content } = await req.json();
    if (!websiteId || !slug) {
      return NextResponse.json({ error: "websiteId and slug are required" }, { status: 400 });
    }

    const website = await prisma.website.findFirst({ where: { id: websiteId, userId: user.userId, deletedAt: null } });
    if (!website) return NextResponse.json({ error: "Website not found" }, { status: 404 });

    const maxOrder = await prisma.websitePage.findFirst({
      where: { websiteId },
      orderBy: { order: "desc" },
    });

    const page = await prisma.websitePage.create({
      data: {
        websiteId,
        slug,
        title: title || null,
        content: content || [],
        order: (maxOrder?.order ?? -1) + 1,
      },
    });
    return NextResponse.json({ page });
  } catch {
    return NextResponse.json({ error: "Failed to create page" }, { status: 500 });
  }
}
