import { NextRequest } from "next/server";
import { listConversationsController, sendMessageController } from "@/modules/chat/chat.controller";

export async function GET() {
  return listConversationsController();
}

export async function POST(req: NextRequest) {
  return sendMessageController(req);
}
