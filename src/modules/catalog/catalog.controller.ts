import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { verifyAccessToken } from "@/modules/auth/auth.service";

export async function listItemsController(req: NextRequest) {
  try {
    const token = (await cookies()).get("token")?.value;
    const user = token ? verifyAccessToken(token) : null;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const where: Record<string, unknown> = { userId: user.userId };
    if (category) where.category = category;

    const items = await prisma.catalogItem.findMany({ where, orderBy: { createdAt: "desc" } });
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}

export async function createItemController(req: NextRequest) {
  try {
    const token = (await cookies()).get("token")?.value;
    const user = token ? verifyAccessToken(token) : null;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, description, priceEgp, category } = await req.json();
    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    const item = await prisma.catalogItem.create({
      data: { userId: user.userId, name, description, priceEgp: priceEgp ? Number(priceEgp) : null, category },
    });
    return NextResponse.json({ item });
  } catch {
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
  }
}

export async function updateItemController(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = (await cookies()).get("token")?.value;
    const user = token ? verifyAccessToken(token) : null;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const existing = await prisma.catalogItem.findFirst({ where: { id, userId: user.userId } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const { name, description, priceEgp, category, imageUrl, isActive } = await req.json();
    const item = await prisma.catalogItem.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(priceEgp !== undefined && { priceEgp: Number(priceEgp) }),
        ...(category !== undefined && { category }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(isActive !== undefined && { isActive }),
      },
    });
    return NextResponse.json({ item });
  } catch {
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

export async function deleteItemController(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = (await cookies()).get("token")?.value;
    const user = token ? verifyAccessToken(token) : null;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const existing = await prisma.catalogItem.findFirst({ where: { id, userId: user.userId } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.catalogItem.update({ where: { id }, data: { isActive: false } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
