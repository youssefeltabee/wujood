import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { verifyAccessToken } from "@/modules/auth/auth.service";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = (await cookies()).get("token")?.value;
    const user = token ? verifyAccessToken(token) : null;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const post = await prisma.blogPost.findFirst({ where: { id, authorId: user.userId } });
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const { title, slug, content, excerpt, imageUrl, tags, publishedAt } = await req.json();

    const data: Record<string, unknown> = {};
    if (title !== undefined) data.title = title;
    if (slug !== undefined) data.slug = slug;
    if (content !== undefined) data.content = content;
    if (excerpt !== undefined) data.excerpt = excerpt;
    if (imageUrl !== undefined) data.imageUrl = imageUrl;
    if (tags !== undefined) data.tags = tags;
    if (publishedAt !== undefined) data.publishedAt = publishedAt ? new Date(publishedAt) : publishedAt;

    const updated = await prisma.blogPost.update({ where: { id }, data });

    return NextResponse.json({ post: updated });
  } catch {
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = (await cookies()).get("token")?.value;
    const user = token ? verifyAccessToken(token) : null;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const post = await prisma.blogPost.findFirst({ where: { id, authorId: user.userId } });
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.blogPost.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
