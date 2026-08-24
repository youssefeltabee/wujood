import { createHash } from "crypto";
import { prisma } from "@/lib/db";
import { signAccessToken, generateRefreshToken } from "./auth.service";

const REFRESH_TOKEN_EXPIRY_DAYS = 30;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: string, email?: string): Promise<{ accessToken: string; refreshToken: string }> {
  const accessToken = await signAccessToken({ userId, email: email ?? "" });
  const refreshToken = generateRefreshToken();

  await prisma.refreshToken.create({
    data: {
      userId,
      token: hashToken(refreshToken),
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000),
    },
  });

  return { accessToken, refreshToken };
}

export async function rotateRefreshToken(
  oldToken: string
): Promise<{ accessToken: string; refreshToken: string } | null> {
  const tokenHash = hashToken(oldToken);

  const existing = await prisma.refreshToken.findUnique({
    where: { token: tokenHash },
    include: { user: { select: { email: true } } },
  });
  if (!existing) return null;

  // Reuse of a revoked token means the family is compromised — kill everything.
  if (existing.revokedAt) {
    await revokeAllUserSessions(existing.userId);
    return null;
  }

  if (existing.expiresAt < new Date()) return null;

  await prisma.refreshToken.updateMany({
    where: { token: tokenHash, revokedAt: null },
    data: { revokedAt: new Date() },
  });

  const accessToken = await signAccessToken({ userId: existing.userId, email: existing.user.email });
  const refreshToken = generateRefreshToken();

  await prisma.refreshToken.create({
    data: {
      userId: existing.userId,
      token: hashToken(refreshToken),
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000),
    },
  });

  return { accessToken, refreshToken };
}

export async function revokeRefreshToken(token: string): Promise<void> {
  await prisma.refreshToken.updateMany({
    where: { token: hashToken(token), revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

export async function revokeAllUserSessions(userId: string): Promise<void> {
  await prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}
