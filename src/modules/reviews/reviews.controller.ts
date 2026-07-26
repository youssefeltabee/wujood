import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authenticateUser } from "@/lib/auth";

export async function listReviewsController() {
  try {
    const auth = await authenticateUser();
    if (auth instanceof NextResponse) return auth;

    const reviews = await prisma.review.findMany({
      where: { userId: auth.userId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ reviews });
  } catch {
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function createReviewController(req: NextRequest) {
  try {
    const auth = await authenticateUser();
    if (auth instanceof NextResponse) return auth;

    const { authorName, content, rating, source } = await req.json();
    if (!authorName || !content || !rating) {
      return NextResponse.json({ error: "authorName, content, and rating are required" }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: { userId: auth.userId, authorName, content, rating, source },
    });
    return NextResponse.json({ review });
  } catch {
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}

export async function updateReviewController(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await authenticateUser();
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;
    const existing = await prisma.review.findFirst({ where: { id, userId: auth.userId } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const { authorName, content, rating, source, isApproved } = await req.json();
    const review = await prisma.review.update({
      where: { id },
      data: {
        ...(authorName !== undefined && { authorName }),
        ...(content !== undefined && { content }),
        ...(rating !== undefined && { rating }),
        ...(source !== undefined && { source }),
        ...(isApproved !== undefined && { isApproved }),
      },
    });
    return NextResponse.json({ review });
  } catch {
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
  }
}

export async function deleteReviewController(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await authenticateUser();
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;
    const existing = await prisma.review.findFirst({ where: { id, userId: auth.userId } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.review.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}

export async function publicReviewsController(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) return NextResponse.json({ error: "userId is required" }, { status: 400 });

    const reviews = await prisma.review.findMany({
      where: { userId, isApproved: true },
      orderBy: { createdAt: "desc" },
      select: { authorName: true, content: true, rating: true, source: true, createdAt: true },
    });
    return NextResponse.json({ reviews });
  } catch {
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}
