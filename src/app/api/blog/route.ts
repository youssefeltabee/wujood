import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authenticateUser } from "@/lib/auth";
import { handleApiError } from "@/lib/errors";

export async function GET() {
  try {
    const user = await authenticateUser();

    const posts = await prisma.blogPost.findMany({
      where: { authorId: user.userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ posts });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await authenticateUser();

    const { title, slug, content, excerpt, imageUrl, tags } = await req.json();
    if (!title || !slug || !content) {
      return NextResponse.json({ error: "title, slug, and content required" }, { status: 400 });
    }

    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }

    const post = await prisma.blogPost.create({
      data: { authorId: user.userId, title, slug, content, excerpt, imageUrl, tags: tags || [] },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
