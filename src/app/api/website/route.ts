import { NextRequest } from "next/server";
import { getWebsiteController, createWebsiteController, updateWebsiteController } from "@/modules/website/website.controller";

export async function GET() {
  return getWebsiteController();
}

export async function POST(req: NextRequest) {
  return createWebsiteController(req);
}

export async function PUT(req: NextRequest) {
  return updateWebsiteController(req);
}
