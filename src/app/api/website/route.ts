import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { verifyAccessToken } from "@/modules/auth/auth.service";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 63);
}

export async function GET() {
  try {
    const token = (await cookies()).get("token")?.value;
    const user = token ? verifyAccessToken(token) : null;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const website = await prisma.website.findFirst({
      where: { userId: user.userId, deletedAt: null },
      include: { pages: { orderBy: { order: "asc" } } },
    });
    return NextResponse.json({ website });
  } catch {
    return NextResponse.json({ error: "Failed to fetch website" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = (await cookies()).get("token")?.value;
    const user = token ? verifyAccessToken(token) : null;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { title, description } = await req.json();
    if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

    const domain = slugify(title);
    const existing = await prisma.website.findFirst({ where: { domain, deletedAt: null } });
    if (existing) {
      return NextResponse.json({ error: "Domain slug already taken. Try a different title." }, { status: 409 });
    }

    const website = await prisma.website.create({
      data: { userId: user.userId, title, description, domain },
      include: { pages: true },
    });
    return NextResponse.json({ website });
  } catch {
    return NextResponse.json({ error: "Failed to create website" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = (await cookies()).get("token")?.value;
    const user = token ? verifyAccessToken(token) : null;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const existing = await prisma.website.findFirst({ where: { userId: user.userId, deletedAt: null } });
    if (!existing) return NextResponse.json({ error: "No website found" }, { status: 404 });

    const { title, description, domain, colors, isPublished } = await req.json();

    const data: Record<string, unknown> = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (domain !== undefined) {
      if (domain !== existing.domain) {
        const taken = await prisma.website.findFirst({ where: { domain, deletedAt: null, id: { not: existing.id } } });
        if (taken) return NextResponse.json({ error: "Domain slug already taken" }, { status: 409 });
      }
      data.domain = domain;
    }
    if (colors !== undefined) data.colors = colors;
    if (isPublished !== undefined) data.isPublished = isPublished;

    const website = await prisma.website.update({
      where: { id: existing.id },
      data,
      include: { pages: { orderBy: { order: "asc" } } },
    });
    return NextResponse.json({ website });
  } catch {
    return NextResponse.json({ error: "Failed to update website" }, { status: 500 });
  }
}
