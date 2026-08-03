import { prisma } from "@/lib/db";
import { NotFoundError } from "@/lib/errors";

export async function getReviews(userId: string) {
  return prisma.review.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
}

export async function getReview(id: string, userId: string) {
  const review = await prisma.review.findFirst({ where: { id, userId } });
  if (!review) throw new NotFoundError("Review");
  return review;
}

export async function createReview(userId: string, data: { authorName: string; content: string; rating: number; source?: string }) {
  return prisma.review.create({ data: { ...data, userId } });
}

export async function updateReview(id: string, userId: string, data: { authorName?: string; content?: string; rating?: number; source?: string; isApproved?: boolean }) {
  const review = await prisma.review.findFirst({ where: { id, userId } });
  if (!review) throw new NotFoundError("Review");
  return prisma.review.update({ where: { id }, data });
}

export async function deleteReview(id: string, userId: string) {
  const review = await prisma.review.findFirst({ where: { id, userId } });
  if (!review) throw new NotFoundError("Review");
  return prisma.review.delete({ where: { id } });
}

export async function getPublicReviews(userId: string) {
  return prisma.review.findMany({
    where: { userId, isApproved: true },
    orderBy: { createdAt: "desc" },
    select: { authorName: true, content: true, rating: true, source: true, createdAt: true },
  });
}
