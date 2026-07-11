import { NextRequest } from "next/server";
import { updateReviewController, deleteReviewController } from "@/modules/reviews/reviews.controller";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return updateReviewController(req, { params });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return deleteReviewController(req, { params });
}
