import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authenticateUser } from "@/lib/auth";
import { handleApiError } from "@/lib/errors";
import { validateBody } from "@/lib/validate";
import * as blogService from "./blog.service";

const createPostSchema = z.object({
  title: z.string().min(1, "title, slug, and content required"),
  slug: z.string().min(1, "title, slug, and content required"),
  content: z.string().min(1, "title, slug, and content required"),
  excerpt: z.string().optional(),
  imageUrl: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

const updatePostSchema = createPostSchema.partial().extend({
  publishedAt: z.coerce.date().nullable().optional(),
});

export async function listPostsController() {
  try {
    const user = await authenticateUser();
    const posts = await blogService.getPosts(user.userId);
    return NextResponse.json({ posts });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function createPostController(req: NextRequest) {
  try {
    const user = await authenticateUser();
    const result = await validateBody(req, createPostSchema);
    if ("error" in result) return handleApiError(result.error);
    const post = await blogService.createPost(user.userId, result.data);
    return NextResponse.json({ post }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function updatePostController(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await authenticateUser();
    const { id } = await params;
    const result = await validateBody(req, updatePostSchema);
    if ("error" in result) return handleApiError(result.error);
    const post = await blogService.updatePost(id, user.userId, result.data);
    return NextResponse.json({ post });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function deletePostController(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await authenticateUser();
    const { id } = await params;
    await blogService.deletePost(id, user.userId);
    return NextResponse.json({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}
