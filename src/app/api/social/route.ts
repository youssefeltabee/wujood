import { NextRequest } from "next/server";
import { listAccountsController, createAccountController } from "@/modules/social/social.controller";

export async function GET() { return listAccountsController(); }
export async function POST(req: NextRequest) { return createAccountController(req); }
