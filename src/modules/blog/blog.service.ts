import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { ConflictError, NotFoundError } from "@/lib/errors";

function isSlugTakenError(err: unknown): boolean {
  return err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002";
}

async function requirePost(id: string, authorId: string) {
  const post = await prisma.blogPost.findFirst({ where: { id, authorId } });
  if (!post) throw new NotFoundError("Post");
  return post;
}

export async function getPosts(authorId: string) {
  return prisma.blogPost.findMany({
    where: { authorId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createPost(
  authorId: string,
  data: { title: string; slug: string; content: string; excerpt?: string; imageUrl?: string; tags?: string[] },
) {
  const existing = await prisma.blogPost.findUnique({ where: { slug: data.slug } });
  if (existing) throw new ConflictError("Slug already exists");
  try {
    return await prisma.blogPost.create({ data: { ...data, tags: data.tags || [], authorId } });
  } catch (err) {
    if (isSlugTakenError(err)) throw new ConflictError("Slug already exists");
    throw err;
  }
}

export async function updatePost(
  id: string,
  authorId: string,
  data: {
    title?: string;
    slug?: string;
    content?: string;
    excerpt?: string;
    imageUrl?: string;
    tags?: string[];
    publishedAt?: Date | null;
  },
) {
  await requirePost(id, authorId);
  try {
    return await prisma.blogPost.update({ where: { id }, data });
  } catch (err) {
    if (isSlugTakenError(err)) throw new ConflictError("Slug already exists");
    throw err;
  }
}

export async function deletePost(id: string, authorId: string) {
  await requirePost(id, authorId);
  await prisma.blogPost.delete({ where: { id } });
}
