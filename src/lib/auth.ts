import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function createToken(userId: string): string {
  if (!JWT_SECRET) throw new Error("JWT_SECRET not configured");
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    if (!JWT_SECRET) throw new Error("JWT_SECRET not configured");
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch { return null; }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("wujood_token")?.value;
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload) return null;
  const user = await prisma.user.findUnique({ where: { id: payload.userId }, include: { subscription: true } });
  return user;
}

export async function setTokenCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("wujood_token", token, {
    httpOnly: true, secure: process.env.NODE_ENV === "production",
    sameSite: "lax", maxAge: 7 * 24 * 60 * 60, path: "/",
  });
}
