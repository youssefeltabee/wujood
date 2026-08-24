import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { verifyAccessToken } from "@/modules/auth/auth.service";
import { handleApiError } from "@/lib/errors";
import { slugify } from "@/utils/formatting";

function isDomainTakenError(err: unknown): boolean {
  return err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002";
}

export async function GET() {
  try {
    const token = (await cookies()).get("token")?.value;
    const user = token ? await verifyAccessToken(token) : null;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const website = await prisma.website.findFirst({
      where: { userId: user.userId, deletedAt: null },
      include: { pages: { orderBy: { order: "asc" } } },
    });
    return NextResponse.json({ website });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = (await cookies()).get("token")?.value;
    const user = token ? await verifyAccessToken(token) : null;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { title, description } = await req.json();
    if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

    const domain = slugify(title);
    const existing = await prisma.website.findFirst({ where: { domain, deletedAt: null } });
    if (existing) {
      return NextResponse.json({ error: "domain_taken" }, { status: 409 });
    }

    const website = await prisma.website.create({
      data: { userId: user.userId, title, description, domain },
      include: { pages: true },
    });
    return NextResponse.json({ website });
  } catch (err) {
    if (isDomainTakenError(err)) {
      return NextResponse.json({ error: "domain_taken" }, { status: 409 });
    }
    return handleApiError(err);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = (await cookies()).get("token")?.value;
    const user = token ? await verifyAccessToken(token) : null;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const existing = await prisma.website.findFirst({ where: { userId: user.userId, deletedAt: null } });
    if (!existing) return NextResponse.json({ error: "No website found" }, { status: 404 });

    const { title, description, domain, colors, isPublished } = await req.json();

    const data: Record<string, unknown> = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (domain !== undefined) {
      const nextDomain = slugify(domain);
      if (nextDomain !== existing.domain) {
        const taken = await prisma.website.findFirst({ where: { domain: nextDomain, deletedAt: null, id: { not: existing.id } } });
        if (taken) return NextResponse.json({ error: "domain_taken" }, { status: 409 });
      }
      data.domain = nextDomain;
    }
    if (colors !== undefined) data.colors = colors;
    if (isPublished !== undefined) data.isPublished = isPublished;

    const website = await prisma.website.update({
      where: { id: existing.id },
      data,
      include: { pages: { orderBy: { order: "asc" } } },
    });
    return NextResponse.json({ website });
  } catch (err) {
    if (isDomainTakenError(err)) {
      return NextResponse.json({ error: "domain_taken" }, { status: 409 });
    }
    return handleApiError(err);
  }
}
