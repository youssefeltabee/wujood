import { NextRequest } from "next/server";
import { updateItemController, deleteItemController } from "@/modules/catalog/catalog.controller";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return updateItemController(req, { params });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return deleteItemController(req, { params });
}
