import { meController } from "@/modules/auth/auth.controller";

export async function GET() {
  return meController();
}
