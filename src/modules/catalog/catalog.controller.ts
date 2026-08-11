import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/lib/auth";
import { handleApiError } from "@/lib/errors";
import * as catalogService from "./catalog.service";

export async function listItemsController(req: NextRequest) {
  try {
    const user = await authenticateUser();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const items = await catalogService.getCatalogItems(user.userId, category);
    return NextResponse.json({ items });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function createItemController(req: NextRequest) {
  try {
    const user = await authenticateUser();
    const { name, description, priceEgp, category } = await req.json();
    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
    const item = await catalogService.createCatalogItem(user.userId, { name, description, priceEgp, category });
    return NextResponse.json({ item });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function updateItemController(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await authenticateUser();
    const { id } = await params;
    const { name, description, priceEgp, category, imageUrl, isActive } = await req.json();
    const item = await catalogService.updateCatalogItem(id, user.userId, { name, description, priceEgp, category, imageUrl, isActive });
    return NextResponse.json({ item });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function deleteItemController(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await authenticateUser();
    const { id } = await params;
    await catalogService.softDeleteCatalogItem(id, user.userId);
    return NextResponse.json({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}
