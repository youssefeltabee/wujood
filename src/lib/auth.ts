import { cookies } from "next/headers";
import { verifyAccessToken } from "@/modules/auth/auth.service";
import { UnauthorizedError } from "@/lib/errors";

export type AuthedUser = { userId: string; email: string };

export async function authenticateUser(): Promise<AuthedUser> {
  const token = (await cookies()).get("token")?.value;
  const user = token ? verifyAccessToken(token) : null;
  if (!user) throw new UnauthorizedError();
  return user;
}

export async function optionalUser(): Promise<AuthedUser | null> {
  const token = (await cookies()).get("token")?.value;
  return token ? verifyAccessToken(token) : null;
}
