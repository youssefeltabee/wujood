import { NextRequest } from "next/server";
import { publicReviewsController } from "@/modules/reviews/reviews.controller";

export async function GET(req: NextRequest) {
  return publicReviewsController(req);
}
