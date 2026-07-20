import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword, setCookieOptions, verifyAccessToken } from "./auth.service";
import { createSession, rotateRefreshToken, revokeRefreshToken } from "./auth.session";
import { sendWelcomeEmail } from "@/modules/email/email.service";
import { rateLimit } from "@/lib/rate-limit";

export async function loginController(req: Request) {
  const ip = req.headers?.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = rateLimit(`login:${ip}`, { interval: 60000, maxRequests: 5 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const { accessToken, refreshToken } = await createSession(user.id);
    const res = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name },
    });
    res.cookies.set("token", accessToken, setCookieOptions(900));
    res.cookies.set("refresh_token", refreshToken, setCookieOptions(30 * 86400));
    return res;
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}

export async function registerController(req: Request) {
  try {
    const { email, password, name } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, passwordHash, name: name || null },
    });

    const { accessToken, refreshToken } = await createSession(user.id);
    const res = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name },
    });
    res.cookies.set("token", accessToken, setCookieOptions(900));
    res.cookies.set("refresh_token", refreshToken, setCookieOptions(30 * 86400));

    sendWelcomeEmail(user.email, user.name || "there").catch((err) => console.error("Welcome email failed:", err));

    return res;
  } catch (err) {
    console.error("REGISTER_ERROR:", err);
    return NextResponse.json({ error: "Registration failed", detail: String(err) }, { status: 500 });
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
  } catch {
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}

export async function refreshController() {
  try {
    const cookieStore = await cookies();
    const oldToken = cookieStore.get("refresh_token")?.value;
    if (!oldToken) {
      return NextResponse.json({ error: "No refresh token" }, { status: 401 });
    }

    const result = await rotateRefreshToken(oldToken);
    if (!result) {
      return NextResponse.json({ error: "Invalid or expired refresh token" }, { status: 401 });
    }

    const res = NextResponse.json({ success: true });
    res.cookies.set("token", result.accessToken, setCookieOptions(900));
    res.cookies.set("refresh_token", result.refreshToken, setCookieOptions(30 * 86400));
    return res;
  } catch {
    return NextResponse.json({ error: "Token refresh failed" }, { status: 500 });
  }
}

export async function meController() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyAccessToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, name: true, companyName: true, companySize: true, phone: true, role: true, businessType: true, createdAt: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

export async function updateMeController(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyAccessToken(token);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const user = await prisma.user.update({
      where: { id: payload.userId },
      data: {
        ...(body.companyName !== undefined && { companyName: body.companyName }),
        ...(body.businessType !== undefined && { businessType: body.businessType }),
        ...(body.companySize !== undefined && { companySize: body.companySize }),
        ...(body.name !== undefined && { name: body.name }),
        ...(body.phone !== undefined && { phone: body.phone }),
      },
      select: { id: true, email: true, name: true, companyName: true, companySize: true, phone: true, role: true, businessType: true, createdAt: true },
    });

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
