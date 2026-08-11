import { NextRequest } from "next/server";
import { auditStatusController } from "@/modules/audit/audit.controller";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return auditStatusController(req, { params });
}
