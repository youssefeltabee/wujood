import { NextRequest } from "next/server";
import { createAuditController, listAuditsController } from "@/modules/audit/audit.controller";

export async function POST(req: NextRequest) {
  return createAuditController(req);
}

export async function GET() {
  return listAuditsController();
}
