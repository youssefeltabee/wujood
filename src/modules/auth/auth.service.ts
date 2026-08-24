import bcrypt from "bcryptjs";
import crypto from "crypto";
import { getJwtSecret, signAccessToken, verifyAccessToken } from "@/lib/jwt";

// M-7 guard: fail fast at startup when JWT_SECRET is missing or weak.
getJwtSecret();

export { getJwtSecret, signAccessToken, verifyAccessToken };

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateRefreshToken(): string {
  return crypto.randomBytes(40).toString("hex");
}

export function setCookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}
