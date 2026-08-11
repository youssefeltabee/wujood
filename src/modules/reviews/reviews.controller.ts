import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/lib/auth";
import { handleApiError } from "@/lib/errors";
import * as reviewsService from "./reviews.service";

export async function listReviewsController() {
  try {
    const user = await authenticateUser();
    const reviews = await reviewsService.getReviews(user.userId);
    return NextResponse.json({ reviews });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function createReviewController(req: NextRequest) {
  try {
    const user = await authenticateUser();
    const { authorName, content, rating, source } = await req.json();
    if (!authorName || !content || !rating) {
      return NextResponse.json({ error: "authorName, content, and rating are required" }, { status: 400 });
    }
    const review = await reviewsService.createReview(user.userId, { authorName, content, rating, source });
    return NextResponse.json({ review });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function updateReviewController(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await authenticateUser();
    const { id } = await params;
    const { authorName, content, rating, source, isApproved } = await req.json();
    const review = await reviewsService.updateReview(id, user.userId, { authorName, content, rating, source, isApproved });
    return NextResponse.json({ review });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function deleteReviewController(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await authenticateUser();
    const { id } = await params;
    await reviewsService.deleteReview(id, user.userId);
    return NextResponse.json({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function publicReviewsController(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) return NextResponse.json({ error: "userId is required" }, { status: 400 });
    const reviews = await reviewsService.getPublicReviews(userId);
    return NextResponse.json({ reviews });
  } catch (err) {
    return handleApiError(err);
  }
}
