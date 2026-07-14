import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const result: Record<string, unknown> = {};
  result.hasDatabaseUrl = !!process.env.DATABASE_URL;
  result.hasDirectUrl = !!process.env.DIRECT_URL;
  result.dbPrefix = process.env.DATABASE_URL?.substring(0, 30);

  try {
    const posts = await prisma.blogPost.findMany({ take: 1 });
    result.postCount = posts.length;
    result.status = "ok";
  } catch (e: unknown) {
    result.status = "error";
    result.error = e instanceof Error ? e.message : String(e);
    result.errorName = e instanceof Error ? e.name : typeof e;
  }

  return NextResponse.json(result);
}
