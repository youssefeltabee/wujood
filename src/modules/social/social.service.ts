import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import { NotFoundError, ConflictError } from "@/lib/errors";

export async function getSocialAccounts(userId: string) {
  return prisma.socialAccount.findMany({
    where: { userId },
    orderBy: { platform: "asc" },
    select: { id: true, platform: true, handle: true },
  });
}

export async function connectSocialAccount(userId: string, data: { platform: string; handle: string; token?: string }) {
  const existing = await prisma.socialAccount.findUnique({
    where: { userId_platform: { userId, platform: data.platform } },
  });
  if (existing) throw new ConflictError("Account already connected");
  return prisma.socialAccount.create({ data: { ...data, userId } });
}

export async function disconnectSocialAccount(id: string, userId: string) {
  const account = await prisma.socialAccount.findFirst({ where: { id, userId } });
  if (!account) throw new NotFoundError("Social account");
  return prisma.socialAccount.delete({ where: { id } });
}

export async function getSocialPosts(userId: string, filters?: { status?: string; accountId?: string }) {
  const where: Prisma.SocialPostWhereInput = { account: { userId } };
  if (filters?.status) where.status = filters.status;
  if (filters?.accountId) where.accountId = filters.accountId;
  return prisma.socialPost.findMany({
    where,
    include: { account: { select: { platform: true, handle: true } }, analytics: true },
    orderBy: { scheduledAt: "desc" },
  });
}

export async function createSocialPost(userId: string, data: { accountId: string; content: string; mediaUrls?: string[]; scheduledAt?: string }) {
  const account = await prisma.socialAccount.findFirst({ where: { id: data.accountId, userId } });
  if (!account) throw new NotFoundError("Social account");
  const scheduled = data.scheduledAt ? new Date(data.scheduledAt) : null;
  const status = scheduled && scheduled > new Date() ? "scheduled" : "draft";
  return prisma.socialPost.create({
    data: { accountId: data.accountId, content: data.content, mediaUrls: data.mediaUrls || [], scheduledAt: scheduled, status },
    include: { account: { select: { platform: true, handle: true } } },
  });
}

export async function deleteSocialPost(id: string, userId: string) {
  const post = await prisma.socialPost.findFirst({ where: { id, account: { userId } } });
  if (!post) throw new NotFoundError("Post");
  return prisma.socialPost.delete({ where: { id } });
}

export async function getPostAnalytics(id: string, userId: string) {
  const post = await prisma.socialPost.findFirst({ where: { id, account: { userId } } });
  if (!post) throw new NotFoundError("Post");
  const analytics = await prisma.socialAnalytics.findUnique({ where: { postId: id } });
  return analytics || { likes: 0, shares: 0, comments: 0, clicks: 0, reach: 0 };
}
