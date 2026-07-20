import { prisma } from "@/lib/db";
import { signAccessToken, generateRefreshToken } from "./auth.service";

const REFRESH_TOKEN_EXPIRY_DAYS = 30;

export async function createSession(userId: string): Promise<{ accessToken: string; refreshToken: string }> {
  const accessToken = signAccessToken({ userId, email: "" });
  const refreshToken = generateRefreshToken();

  await prisma.refreshToken.create({
    data: {
      userId,
      token: refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000),
    },
  });

  return { accessToken, refreshToken };
}

export async function rotateRefreshToken(
  oldToken: string
): Promise<{ accessToken: string; refreshToken: string } | null> {
  const result = await prisma.refreshToken.updateMany({
    where: { token: oldToken, revokedAt: null, expiresAt: { gte: new Date() } },
    data: { revokedAt: new Date() },
  });
  if (result.count === 0) return null;

  const existing = await prisma.refreshToken.findUnique({ where: { token: oldToken } });
  if (!existing) return null;

  const accessToken = signAccessToken({ userId: existing.userId, email: "" });
  const refreshToken = generateRefreshToken();

  await prisma.refreshToken.create({
    data: {
      userId: existing.userId,
      token: refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000),
    },
  });

  return { accessToken, refreshToken };
}

export async function revokeRefreshToken(token: string): Promise<void> {
  await prisma.refreshToken.updateMany({
    where: { token, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

export async function revokeAllUserSessions(userId: string): Promise<void> {
  await prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}
