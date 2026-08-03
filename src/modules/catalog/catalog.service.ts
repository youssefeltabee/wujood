import { prisma } from "@/lib/db";
import { NotFoundError } from "@/lib/errors";

export async function getCatalogItems(userId: string, category?: string) {
  const where: Record<string, unknown> = { userId };
  if (category) where.category = category;
  return prisma.catalogItem.findMany({ where, orderBy: { createdAt: "desc" } });
}

export async function getCatalogItem(id: string, userId: string) {
  const item = await prisma.catalogItem.findFirst({ where: { id, userId } });
  if (!item) throw new NotFoundError("Catalog item");
  return item;
}

export async function createCatalogItem(userId: string, data: { name: string; description?: string; priceEgp?: number; category?: string }) {
  return prisma.catalogItem.create({ data: { ...data, userId } });
}

export async function updateCatalogItem(id: string, userId: string, data: { name?: string; description?: string; priceEgp?: number; category?: string; imageUrl?: string; isActive?: boolean }) {
  const item = await prisma.catalogItem.findFirst({ where: { id, userId } });
  if (!item) throw new NotFoundError("Catalog item");
  return prisma.catalogItem.update({ where: { id }, data });
}

export async function softDeleteCatalogItem(id: string, userId: string) {
  const item = await prisma.catalogItem.findFirst({ where: { id, userId } });
  if (!item) throw new NotFoundError("Catalog item");
  return prisma.catalogItem.update({ where: { id }, data: { isActive: false } });
}
