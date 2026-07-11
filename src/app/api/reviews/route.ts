import { NextRequest } from "next/server";
import { listReviewsController, createReviewController } from "@/modules/reviews/reviews.controller";

export async function GET() {
  return listReviewsController();
}

export async function POST(req: NextRequest) {
  return createReviewController(req);
}
