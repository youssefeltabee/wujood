import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { authenticateUser } from "@/lib/auth";
import { handleApiError } from "@/lib/errors";
import { rateLimit } from "@/lib/rate-limit";
import { generateChatResponse } from "./chat.service";

const MAX_MESSAGE_CHARS = 2000;
const MAX_HISTORY_TURNS = 20;
const MAX_STORED_MESSAGES = 40;

const sendMessageSchema = z.object({
  conversationId: z.string().optional(),
  message: z.string().min(1).max(MAX_MESSAGE_CHARS),
});

export async function listConversationsController() {
  try {
    const user = await authenticateUser();

    const conversations = await prisma.conversation.findMany({
      where: { userId: user.userId },
      include: { contact: { select: { name: true, phone: true } } },
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json({ conversations });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function getConversationController(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await authenticateUser();

    const { id } = await params;
    const conversation = await prisma.conversation.findFirst({
      where: { id, userId: user.userId },
      include: { contact: { select: { name: true, phone: true, email: true } } },
    });
    if (!conversation) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ conversation });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function sendMessageController(req: NextRequest) {
  try {
    const user = await authenticateUser();

    const rl = await rateLimit(`chat:${user.userId}`, { interval: 60_000, maxRequests: 10 });
    if (!rl.success) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    const parsed = sendMessageSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: "Message is required (max 2000 chars)" }, { status: 400 });
    const { conversationId, message } = parsed.data;

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

    const updatedMessages = [...existingMessages, { role: "user", content: message }];
    const aiResponse = await generateChatResponse(updatedMessages.slice(-MAX_HISTORY_TURNS));
    const finalMessages = [...updatedMessages, aiResponse].slice(-MAX_STORED_MESSAGES);

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
  } catch (err) {
    return handleApiError(err);
  }
}

export async function deleteConversationController(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await authenticateUser();

    const { id } = await params;
    const existing = await prisma.conversation.findFirst({ where: { id, userId: user.userId } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.conversation.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}
