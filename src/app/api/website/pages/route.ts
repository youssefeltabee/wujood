import { NextRequest } from "next/server";
import { createPageController } from "@/modules/website/website.controller";

export async function POST(req: NextRequest) {
  return createPageController(req);
}
