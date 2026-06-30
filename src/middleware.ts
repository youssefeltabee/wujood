import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/audit")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  if ((pathname === "/login" || pathname === "/register") && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/audit/:path*", "/login", "/register"],
};
