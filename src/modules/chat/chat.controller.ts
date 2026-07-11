import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { verifyAccessToken } from "@/modules/auth/auth.service";
import { generateChatResponse } from "./chat.service";

export async function listConversationsController() {
  try {
    const token = (await cookies()).get("token")?.value;
    const user = token ? verifyAccessToken(token) : null;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const conversations = await prisma.conversation.findMany({
      where: { userId: user.userId },
      include: { contact: { select: { name: true, phone: true } } },
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json({ conversations });
  } catch {
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 });
  }
}

export async function getConversationController(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = (await cookies()).get("token")?.value;
    const user = token ? verifyAccessToken(token) : null;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const conversation = await prisma.conversation.findFirst({
      where: { id, userId: user.userId },
      include: { contact: { select: { name: true, phone: true, email: true } } },
    });
    if (!conversation) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ conversation });
  } catch {
    return NextResponse.json({ error: "Failed to fetch conversation" }, { status: 500 });
  }
}

export async function sendMessageController(req: NextRequest) {
  try {
    const token = (await cookies()).get("token")?.value;
    const user = token ? verifyAccessToken(token) : null;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { conversationId, message } = await req.json();
    if (!message) return NextResponse.json({ error: "Message is required" }, { status: 400 });

    let conversation;
    if (conversationId) {
      conversation = await prisma.conversation.findFirst({
        where: { id: conversationId, userId: user.userId },
      });
      if (!conversation) return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    const existingMessages: { role: string; content: string }[] = conversation?.messages
      ? (conversation.messages as { role: string; content: string }[])
      : [];

    const userMessage = { role: "user", content: message };
    const updatedMessages = [...existingMessages, userMessage];
    const aiResponse = await generateChatResponse(updatedMessages);
    const finalMessages = [...updatedMessages, aiResponse];

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          userId: user.userId,
          messages: finalMessages,
          status: "active",
        },
      });
    } else {
      conversation = await prisma.conversation.update({
        where: { id: conversation.id },
        data: { messages: finalMessages },
      });
    }

    return NextResponse.json({ conversation, aiMessage: aiResponse });
  } catch {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

export async function deleteConversationController(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = (await cookies()).get("token")?.value;
    const user = token ? verifyAccessToken(token) : null;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const existing = await prisma.conversation.findFirst({ where: { id, userId: user.userId } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.conversation.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete conversation" }, { status: 500 });
  }
}
