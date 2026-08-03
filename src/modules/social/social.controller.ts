import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/lib/auth";
import { handleApiError } from "@/lib/errors";
import { encrypt } from "@/lib/encryption";
import * as socialService from "./social.service";

export async function listAccountsController() {
  try {
    const user = await authenticateUser();
    const accounts = await socialService.getSocialAccounts(user.userId);
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
    const encryptedToken = socialToken ? encrypt(socialToken) : undefined;
    const account = await socialService.connectSocialAccount(user.userId, { platform, handle, token: encryptedToken });
    return NextResponse.json({ account }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function deleteAccountController(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await authenticateUser();
    const { id } = await params;
    await socialService.disconnectSocialAccount(id, user.userId);
    return NextResponse.json({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function listPostsController(req: NextRequest) {
  try {
    const user = await authenticateUser();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || undefined;
    const accountId = searchParams.get("accountId") || undefined;
    const posts = await socialService.getSocialPosts(user.userId, { status, accountId });
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
    const post = await socialService.createSocialPost(user.userId, { accountId, content, mediaUrls, scheduledAt });
    return NextResponse.json({ post }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function deletePostController(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await authenticateUser();
    const { id } = await params;
    await socialService.deleteSocialPost(id, user.userId);
    return NextResponse.json({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function getAnalyticsController(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await authenticateUser();
    const { id } = await params;
    const analytics = await socialService.getPostAnalytics(id, user.userId);
    return NextResponse.json({ analytics });
  } catch (err) {
    return handleApiError(err);
  }
}
