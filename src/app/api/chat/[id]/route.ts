import { NextRequest } from "next/server";
import { getConversationController, deleteConversationController } from "@/modules/chat/chat.controller";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return getConversationController(req, { params });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return deleteConversationController(req, { params });
}
