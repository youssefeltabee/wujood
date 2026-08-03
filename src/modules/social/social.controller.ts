import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authenticateUser } from "@/lib/auth";
import { handleApiError } from "@/lib/errors";
import { encrypt } from "@/lib/encryption";

export async function listAccountsController() {
  try {
    const user = await authenticateUser();

    const accounts = await prisma.socialAccount.findMany({
      where: { userId: user.userId },
      orderBy: { platform: "asc" },
      select: { id: true, platform: true, handle: true },
    });

    return NextResponse.json({ accounts });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function createAccountController(req: NextRequest) {
  try {
    const user = await authenticateUser();

    const { platform, handle, token: socialToken } = await req.json();
    if (!platform) {
      return NextResponse.json({ error: "Platform required" }, { status: 400 });
    }

    const existing = await prisma.socialAccount.findUnique({
      where: { userId_platform: { userId: user.userId, platform } },
    });
    if (existing) {
      return NextResponse.json({ error: "Account already connected" }, { status: 409 });
    }

    const encryptedToken = socialToken ? encrypt(socialToken) : null;

    const account = await prisma.socialAccount.create({
      data: { userId: user.userId, platform, handle, token: encryptedToken },
    });

    return NextResponse.json({ account }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function deleteAccountController(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await authenticateUser();

    const { id } = await params;
    const account = await prisma.socialAccount.findFirst({ where: { id, userId: user.userId } });
    if (!account) return NextResponse.json({ error: "Account not found" }, { status: 404 });

    await prisma.socialAccount.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function listPostsController(req: NextRequest) {
  try {
    const user = await authenticateUser();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const accountId = searchParams.get("accountId");

    const where: Record<string, unknown> = {
      account: { userId: user.userId },
    };
    if (status) where.status = status;
    if (accountId) where.accountId = accountId;

    const posts = await prisma.socialPost.findMany({
      where: where as any,
      include: { account: { select: { platform: true, handle: true } }, analytics: true },
      orderBy: { scheduledAt: "desc" },
    });

    return NextResponse.json({ posts });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function createPostController(req: NextRequest) {
  try {
    const user = await authenticateUser();

    const { accountId, content, mediaUrls, scheduledAt } = await req.json();
    if (!accountId || !content) {
      return NextResponse.json({ error: "accountId and content required" }, { status: 400 });
    }

    const account = await prisma.socialAccount.findFirst({ where: { id: accountId, userId: user.userId } });
    if (!account) return NextResponse.json({ error: "Account not found" }, { status: 404 });

    const scheduled = scheduledAt ? new Date(scheduledAt) : null;
    const status = scheduled && scheduled > new Date() ? "scheduled" : "draft";

    const post = await prisma.socialPost.create({
      data: { accountId, content, mediaUrls: mediaUrls || [], scheduledAt: scheduled, status },
      include: { account: { select: { platform: true, handle: true } } },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function deletePostController(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await authenticateUser();

    const { id } = await params;
    const post = await prisma.socialPost.findFirst({
      where: { id, account: { userId: user.userId } },
    });
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    await prisma.socialPost.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function getAnalyticsController(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await authenticateUser();

    const { id } = await params;
    const post = await prisma.socialPost.findFirst({
      where: { id, account: { userId: user.userId } },
    });
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    const analytics = await prisma.socialAnalytics.findUnique({ where: { postId: id } });
    return NextResponse.json({ analytics: analytics || { likes: 0, shares: 0, comments: 0, clicks: 0, reach: 0 } });
  } catch (err) {
    return handleApiError(err);
  }
}
