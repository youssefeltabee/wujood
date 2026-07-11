import { NextRequest } from "next/server";
import { listPostsController, createPostController } from "@/modules/social/social.controller";

export async function GET(req: NextRequest) { return listPostsController(req); }
export async function POST(req: NextRequest) { return createPostController(req); }
