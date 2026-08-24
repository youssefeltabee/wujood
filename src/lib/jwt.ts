import { SignJWT, jwtVerify } from "jose";

const WEAK_SECRET_PATTERN = /(change|placeholder|your-secret|secret-key)/i;

export type AccessTokenPayload = { userId: string; email: string };

export function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32 || WEAK_SECRET_PATTERN.test(secret)) {
    throw new Error(
      "JWT_SECRET is missing or too weak. Fix it in your .env file: set JWT_SECRET to a random string of at least 32 characters, e.g. run `node -e \"console.log(require('crypto').randomBytes(48).toString('hex'))\"` and paste the output. It must not contain placeholder words like 'change', 'placeholder', 'your-secret', or 'secret-key'."
    );
  }
  return new TextEncoder().encode(secret);
}

export async function signAccessToken(payload: AccessTokenPayload): Promise<string> {
  return new SignJWT({ userId: payload.userId, email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(getJwtSecret());
}

export async function verifyAccessToken(token: string): Promise<AccessTokenPayload | null> {
  try {
    const { payload } = await jwtVerify<AccessTokenPayload>(token, getJwtSecret());
    if (typeof payload.userId !== "string" || typeof payload.email !== "string") return null;
    return { userId: payload.userId, email: payload.email };
  } catch {
    return null;
  }
}
