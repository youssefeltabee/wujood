import { NextRequest } from "next/server";
import { fawryCallbackController } from "@/modules/payments/payments.controller";

export async function POST(req: NextRequest) {
  return fawryCallbackController(req);
}
