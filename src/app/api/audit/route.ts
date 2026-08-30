import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { createAuditController, listAuditsController } from "@/modules/audit/audit.controller";
import { rateLimit } from "@/lib/rate-limit"; // Upstash Ratelimit with in-memory fallback

// ponytail: 10 req/min per IP via next/headers + Upstash/memo fallback — controller keeps per-user limit
async function checkIpLimit(req: NextRequest): Promise<boolean> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for") ?? req.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || h.get("x-real-ip") || req.headers.get("x-real-ip") || "unknown";
  const { success } = await rateLimit(`audit-ip:${ip}`, { interval: 60_000, maxRequests: 10 });
  return success;
}

export async function POST(req: NextRequest) {
  if (!(await checkIpLimit(req))) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }
  return createAuditController(req);
}

export async function GET(req: NextRequest) {
  if (!(await checkIpLimit(req))) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }
  return listAuditsController(req);
}
