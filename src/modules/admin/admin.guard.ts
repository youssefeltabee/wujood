import { prisma } from "@/lib/db";
import { authenticateUser, type AuthedUser } from "@/lib/auth";
import { ForbiddenError } from "@/lib/errors";

export async function requireAdmin(): Promise<AuthedUser> {
  const user = await authenticateUser();
  const dbUser = await prisma.user.findUnique({ where: { id: user.userId }, select: { role: true } });
  if (!dbUser || dbUser.role !== "ADMIN") throw new ForbiddenError();
  return user;
}
