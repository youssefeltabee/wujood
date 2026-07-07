import { NextResponse } from "next/server";
import { revokeRefreshToken, getRefreshTokenFromCookie, setCookieOptions } from "@/lib/auth";

export async function POST() {
  try {
    const refreshToken = await getRefreshTokenFromCookie();
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
