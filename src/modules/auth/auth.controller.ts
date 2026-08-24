import { NextResponse } from "next/server";
import { z } from "zod";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword, setCookieOptions, verifyAccessToken } from "./auth.service";
import { createSession, rotateRefreshToken, revokeRefreshToken } from "./auth.session";
import { sendWelcomeEmail } from "@/modules/email/email.service";
import { rateLimit } from "@/lib/rate-limit";
import { validateBody } from "@/lib/validate";
import { handleApiError, UnauthorizedError, NotFoundError, ConflictError, RateLimitError } from "@/lib/errors";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1).max(100).optional(),
});

const updateMeSchema = z
  .object({
    name: z.string().max(100).nullable().optional(),
    companyName: z.string().max(200).nullable().optional(),
    companySize: z.string().max(50).nullable().optional(),
    phone: z.string().max(30).nullable().optional(),
    businessType: z.string().max(100).nullable().optional(),
  })
  .strict();

function clientIp(req: Request): string {
  return req.headers?.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export async function loginController(req: Request) {
  try {
    const rl = await rateLimit(`login:${clientIp(req)}`, { interval: 60000, maxRequests: 5 });
    if (!rl.allowed) throw new RateLimitError("Too many attempts. Try again later.");

    const parsed = await validateBody(req, loginSchema);
    if ("error" in parsed) return handleApiError(parsed.error);
    const { email, password } = parsed.data;

    const user = await prisma.user.findFirst({ where: { email, deletedAt: null } });
    if (!user) throw new UnauthorizedError("Invalid credentials");

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) throw new UnauthorizedError("Invalid credentials");

    const { accessToken, refreshToken } = await createSession(user.id, user.email);
    const res = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name },
    });
    res.cookies.set("token", accessToken, setCookieOptions(900));
    res.cookies.set("refresh_token", refreshToken, setCookieOptions(30 * 86400));
    return res;
  } catch (err) {
    return handleApiError(err);
  }
}

export async function registerController(req: Request) {
  try {
    const parsed = await validateBody(req, registerSchema);
    if ("error" in parsed) return handleApiError(parsed.error);
    const { email, password, name } = parsed.data;

    const ipRl = await rateLimit(`register:${clientIp(req)}`, { interval: 60000, maxRequests: 5 });
    if (!ipRl.allowed) throw new RateLimitError("Too many registration attempts. Try again later.");

    const emailRl = await rateLimit(`register-email:${email.toLowerCase()}`, { interval: 3600000, maxRequests: 3 });
    if (!emailRl.allowed) throw new RateLimitError("Too many registration attempts for this email. Try again later.");

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictError("Email already registered");

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, passwordHash, name: name || null },
    });

    const { accessToken, refreshToken } = await createSession(user.id, user.email);
    const res = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name },
    });
    res.cookies.set("token", accessToken, setCookieOptions(900));
    res.cookies.set("refresh_token", refreshToken, setCookieOptions(30 * 86400));

    sendWelcomeEmail(user.email, user.name || "there").catch((err) => console.error("Welcome email failed:", err));

    return res;
  } catch (err) {
    return handleApiError(err);
  }
}

export async function logoutController() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;
    if (refreshToken) {
      await revokeRefreshToken(refreshToken);
    }

    const res = NextResponse.json({ success: true });
    res.cookies.set("token", "", { ...setCookieOptions(0), maxAge: 0 });
    res.cookies.set("refresh_token", "", { ...setCookieOptions(0), maxAge: 0 });
    return res;
  } catch (err) {
    return handleApiError(err);
  }
}

export async function refreshController() {
  try {
    const cookieStore = await cookies();
    const oldToken = cookieStore.get("refresh_token")?.value;
    if (!oldToken) throw new UnauthorizedError("No refresh token");

    const result = await rotateRefreshToken(oldToken);
    if (!result) throw new UnauthorizedError("Invalid or expired refresh token");

    const res = NextResponse.json({ success: true });
    res.cookies.set("token", result.accessToken, setCookieOptions(900));
    res.cookies.set("refresh_token", result.refreshToken, setCookieOptions(30 * 86400));
    return res;
  } catch (err) {
    return handleApiError(err);
  }
}

export async function meController() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) throw new UnauthorizedError();

    const payload = await verifyAccessToken(token);
    if (!payload) throw new UnauthorizedError();

    const user = await prisma.user.findFirst({
      where: { id: payload.userId, deletedAt: null },
      select: { id: true, email: true, name: true, companyName: true, companySize: true, phone: true, role: true, businessType: true, createdAt: true },
    });

    if (!user) throw new NotFoundError("User");

    return NextResponse.json({ user });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function updateMeController(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) throw new UnauthorizedError();

    const payload = await verifyAccessToken(token);
    if (!payload) throw new UnauthorizedError();

    const parsed = await validateBody(req, updateMeSchema);
    if ("error" in parsed) return handleApiError(parsed.error);

    const existing = await prisma.user.findFirst({ where: { id: payload.userId, deletedAt: null } });
    if (!existing) throw new NotFoundError("User");

    const user = await prisma.user.update({
      where: { id: payload.userId },
      data: parsed.data,
      select: { id: true, email: true, name: true, companyName: true, companySize: true, phone: true, role: true, businessType: true, createdAt: true },
    });

    return NextResponse.json({ user });
  } catch (err) {
    return handleApiError(err);
  }
}
