import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/modules/auth/auth.service";

export type AuthedUser = { userId: string; email: string };

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function authenticateUser(): Promise<AuthedUser | NextResponse> {
  const token = (await cookies()).get("token")?.value;
  const user = token ? verifyAccessToken(token) : null;
  if (!user) return unauthorized();
  return user;
}
