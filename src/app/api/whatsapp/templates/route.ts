import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { verifyAccessToken } from "@/modules/auth/auth.service";
import { handleApiError, NotFoundError } from "@/lib/errors";

async function auth() {
  const token = (await cookies()).get("token")?.value;
  return token ? verifyAccessToken(token) : null;
}

export async function GET() {
  try {
    const user = await auth();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const templates = await prisma.whatsAppTemplate.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ templates });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await auth();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, category, content } = await req.json();
    if (!name || !content) {
      return NextResponse.json({ error: "name and content required" }, { status: 400 });
    }

    const template = await prisma.whatsAppTemplate.create({
      data: { name, category: category || "marketing", content, userId: user.userId },
    });

    return NextResponse.json({ template }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await auth();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const template = await prisma.whatsAppTemplate.findFirst({ where: { id, userId: user.userId } });
    if (!template) throw new NotFoundError("Template");

    await prisma.whatsAppTemplate.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}
