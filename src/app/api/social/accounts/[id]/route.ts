import { NextRequest } from "next/server";
import { deleteAccountController } from "@/modules/social/social.controller";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return deleteAccountController(req, { params });
}
