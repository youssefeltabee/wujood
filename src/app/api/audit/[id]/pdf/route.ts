export const runtime = "nodejs";

import { NextRequest } from "next/server";
import { pdfAuditController } from "@/modules/audit/audit.controller";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return pdfAuditController(req, { params });
}
