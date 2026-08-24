import { NextRequest } from "next/server";
import { listPostsController, createPostController } from "@/modules/blog/blog.controller";

export async function GET() {
  return listPostsController();
}

export async function POST(req: NextRequest) {
  return createPostController(req);
}
