import { NextRequest } from "next/server";
import { createFawryCheckoutController } from "@/modules/payments/payments.controller";

export async function POST(req: NextRequest) {
  return createFawryCheckoutController(req);
}
