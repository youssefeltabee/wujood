import { NextResponse } from "next/server";
import { rotateRefreshToken, getRefreshTokenFromCookie, setCookieOptions } from "@/lib/auth";

export async function POST() {
  try {
    const oldToken = await getRefreshTokenFromCookie();
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
