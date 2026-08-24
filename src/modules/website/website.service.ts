import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { ConflictError, NotFoundError } from "@/lib/errors";
import { slugify } from "@/utils/formatting";

function isUniqueConstraintError(err: unknown): boolean {
  return err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002";
}

export async function getWebsite(userId: string) {
  return prisma.website.findFirst({
    where: { userId, deletedAt: null },
    include: { pages: { orderBy: { order: "asc" } } },
  });
}

export async function createWebsite(userId: string, data: { title: string; description?: string }) {
  const domain = slugify(data.title);
  const existing = await prisma.website.findFirst({ where: { domain, deletedAt: null } });
  if (existing) throw new ConflictError("domain_taken");
  try {
    return await prisma.website.create({
      data: { userId, title: data.title, description: data.description, domain },
      include: { pages: true },
    });
  } catch (err) {
    if (isUniqueConstraintError(err)) throw new ConflictError("domain_taken");
    throw err;
  }
}

export async function updateWebsite(
  userId: string,
  data: { title?: string; description?: string | null; domain?: string; colors?: unknown; isPublished?: boolean },
) {
  const existing = await prisma.website.findFirst({ where: { userId, deletedAt: null } });
  if (!existing) throw new NotFoundError("Website");

  const patch: Record<string, unknown> = {};
  if (data.title !== undefined) patch.title = data.title;
  if (data.description !== undefined) patch.description = data.description;
  if (data.domain !== undefined) {
    const nextDomain = slugify(data.domain);
    if (nextDomain !== existing.domain) {
      const taken = await prisma.website.findFirst({
        where: { domain: nextDomain, deletedAt: null, id: { not: existing.id } },
      });
      if (taken) throw new ConflictError("domain_taken");
    }
    patch.domain = nextDomain;
  }
  if (data.colors !== undefined) patch.colors = data.colors;
  if (data.isPublished !== undefined) patch.isPublished = data.isPublished;

  try {
    return await prisma.website.update({
      where: { id: existing.id },
      data: patch,
      include: { pages: { orderBy: { order: "asc" } } },
    });
  } catch (err) {
    if (isUniqueConstraintError(err)) throw new ConflictError("domain_taken");
    throw err;
  }
}

async function requirePage(id: string, userId: string) {
  const page = await prisma.websitePage.findFirst({
    where: { id, website: { userId, deletedAt: null } },
  });
  if (!page) throw new NotFoundError("Page");
  return page;
}

export async function createWebsitePage(
  userId: string,
  data: { websiteId: string; slug: string; title?: string | null; content?: unknown },
) {
  const website = await prisma.website.findFirst({
    where: { id: data.websiteId, userId, deletedAt: null },
  });
  if (!website) throw new NotFoundError("Website");

  const maxOrder = await prisma.websitePage.findFirst({
    where: { websiteId: data.websiteId },
    orderBy: { order: "desc" },
  });

  try {
    return await prisma.websitePage.create({
      data: {
        websiteId: data.websiteId,
        slug: data.slug,
        title: data.title ?? null,
        content: data.content ?? [],
        order: (maxOrder?.order ?? -1) + 1,
      },
    });
  } catch (err) {
    if (isUniqueConstraintError(err)) throw new ConflictError("A page with this slug already exists");
    throw err;
  }
}

export async function updateWebsitePage(
  id: string,
  userId: string,
  data: { slug?: string; title?: string | null; content?: Prisma.InputJsonValue },
) {
  await requirePage(id, userId);
  try {
    // ponytail: passthrough update — zod at controller bounds the keys
    return await prisma.websitePage.update({ where: { id }, data });
  } catch (err) {
    if (isUniqueConstraintError(err)) throw new ConflictError("A page with this slug already exists");
    throw err;
  }
}

export async function deleteWebsitePage(id: string, userId: string) {
  await requirePage(id, userId);
  await prisma.websitePage.delete({ where: { id } });
}
