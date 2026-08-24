import { NextRequest } from "next/server";
import { updatePageController, deletePageController } from "@/modules/website/website.controller";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, ctx: Ctx) {
  return updatePageController(req, ctx);
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  return deletePageController(req, ctx);
}
