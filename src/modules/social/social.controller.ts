import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { verifyAccessToken } from "@/modules/auth/auth.service";

export async function listAccountsController() {
  try {
    const token = (await cookies()).get("token")?.value;
    const user = token ? verifyAccessToken(token) : null;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const accounts = await prisma.socialAccount.findMany({
      where: { userId: user.userId },
      orderBy: { platform: "asc" },
    });

    return NextResponse.json({ accounts });
  } catch {
    return NextResponse.json({ error: "Failed to fetch accounts" }, { status: 500 });
  }
}

export async function createAccountController(req: NextRequest) {
  try {
    const token = (await cookies()).get("token")?.value;
    const user = token ? verifyAccessToken(token) : null;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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

    const account = await prisma.socialAccount.create({
      data: { userId: user.userId, platform, handle, token: socialToken },
    });

    return NextResponse.json({ account }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}

export async function deleteAccountController(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = (await cookies()).get("token")?.value;
    const user = token ? verifyAccessToken(token) : null;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const account = await prisma.socialAccount.findFirst({ where: { id, userId: user.userId } });
    if (!account) return NextResponse.json({ error: "Account not found" }, { status: 404 });

    await prisma.socialAccount.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}

export async function listPostsController(req: NextRequest) {
  try {
    const token = (await cookies()).get("token")?.value;
    const user = token ? verifyAccessToken(token) : null;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
  } catch {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function createPostController(req: NextRequest) {
  try {
    const token = (await cookies()).get("token")?.value;
    const user = token ? verifyAccessToken(token) : null;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
  } catch {
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}

export async function deletePostController(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = (await cookies()).get("token")?.value;
    const user = token ? verifyAccessToken(token) : null;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const post = await prisma.socialPost.findFirst({
      where: { id, account: { userId: user.userId } },
    });
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    await prisma.socialPost.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}

export async function getAnalyticsController(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = (await cookies()).get("token")?.value;
    const user = token ? verifyAccessToken(token) : null;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const post = await prisma.socialPost.findFirst({
      where: { id, account: { userId: user.userId } },
    });
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    const analytics = await prisma.socialAnalytics.findUnique({ where: { postId: id } });
    return NextResponse.json({ analytics: analytics || { likes: 0, shares: 0, comments: 0, clicks: 0, reach: 0 } });
  } catch {
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
