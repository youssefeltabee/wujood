import { NextRequest } from "next/server";
import { getAuditController } from "@/modules/audit/audit.controller";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return getAuditController(req, { params });
}
