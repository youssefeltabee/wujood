import { meController, updateMeController } from "@/modules/auth/auth.controller";

export async function GET() {
  return meController();
}

export async function PUT(req: Request) {
  return updateMeController(req);
}
