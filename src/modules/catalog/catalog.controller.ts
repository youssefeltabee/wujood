import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authenticateUser } from "@/lib/auth";

export async function listItemsController(req: NextRequest) {
  try {
    const auth = await authenticateUser();
    if (auth instanceof NextResponse) return auth;

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const where: Record<string, unknown> = { userId: auth.userId };
    if (category) where.category = category;

    const items = await prisma.catalogItem.findMany({ where, orderBy: { createdAt: "desc" } });
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}

export async function createItemController(req: NextRequest) {
  try {
    const auth = await authenticateUser();
    if (auth instanceof NextResponse) return auth;

    const { name, description, priceEgp, category } = await req.json();
    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    const item = await prisma.catalogItem.create({
      data: {
        userId: auth.userId,
        name,
        description,
        priceEgp: priceEgp !== undefined && priceEgp !== null ? Number(priceEgp) : null,
        category,
      },
    });
    return NextResponse.json({ item });
  } catch {
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
  }
}

export async function updateItemController(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await authenticateUser();
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;
    const existing = await prisma.catalogItem.findFirst({ where: { id, userId: auth.userId } });
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
    const auth = await authenticateUser();
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;
    const existing = await prisma.catalogItem.findFirst({ where: { id, userId: auth.userId } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.catalogItem.update({ where: { id }, data: { isActive: false } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
