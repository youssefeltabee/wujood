import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { authenticateUser } from "@/lib/auth";
import { handleApiError } from "@/lib/errors";
import { validateBody } from "@/lib/validate";
import * as websiteService from "./website.service";

const createWebsiteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

const updateWebsiteSchema = z.object({
  title: z.string().optional(),
  description: z.string().nullable().optional(),
  domain: z.string().optional(),
  colors: z.unknown().optional(),
  isPublished: z.boolean().optional(),
});

const createPageSchema = z.object({
  websiteId: z.string().min(1),
  slug: z.string().min(1, "websiteId and slug are required"),
  title: z.string().nullable().optional(),
  content: z.custom<Prisma.InputJsonValue>().optional(),
});

const updatePageSchema = z.object({
  slug: z.string().min(1).optional(),
  title: z.string().nullable().optional(),
  content: z.custom<Prisma.InputJsonValue>().optional(),
});

export async function getWebsiteController() {
  try {
    const user = await authenticateUser();
    const website = await websiteService.getWebsite(user.userId);
    return NextResponse.json({ website });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function createWebsiteController(req: NextRequest) {
  try {
    const user = await authenticateUser();
    const result = await validateBody(req, createWebsiteSchema);
    if ("error" in result) return handleApiError(result.error);
    const website = await websiteService.createWebsite(user.userId, result.data);
    return NextResponse.json({ website });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function updateWebsiteController(req: NextRequest) {
  try {
    const user = await authenticateUser();
    const result = await validateBody(req, updateWebsiteSchema);
    if ("error" in result) return handleApiError(result.error);
    const website = await websiteService.updateWebsite(user.userId, result.data);
    return NextResponse.json({ website });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function createPageController(req: NextRequest) {
  try {
    const user = await authenticateUser();
    const result = await validateBody(req, createPageSchema);
    if ("error" in result) return handleApiError(result.error);
    const page = await websiteService.createWebsitePage(user.userId, result.data);
    return NextResponse.json({ page });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function updatePageController(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await authenticateUser();
    const { id } = await params;
    const result = await validateBody(req, updatePageSchema);
    if ("error" in result) return handleApiError(result.error);
    const page = await websiteService.updateWebsitePage(id, user.userId, result.data);
    return NextResponse.json({ page });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function deletePageController(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await authenticateUser();
    const { id } = await params;
    await websiteService.deleteWebsitePage(id, user.userId);
    return NextResponse.json({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}
