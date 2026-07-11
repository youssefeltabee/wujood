import { NextRequest } from "next/server";
import { getAnalyticsController } from "@/modules/social/social.controller";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return getAnalyticsController(req, { params });
}
