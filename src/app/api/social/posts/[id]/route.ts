import { NextRequest } from "next/server";
import { deletePostController } from "@/modules/social/social.controller";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return deletePostController(req, { params });
}
