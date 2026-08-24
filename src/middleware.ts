import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/jwt";

export async function middleware(req: NextRequest) {
  const { pathname, hostname } = req.nextUrl;

  const subdomainMatch = hostname.match(/^(.+)\.wujood\.vercel\.app$/);
  if (subdomainMatch) {
    const subdomain = subdomainMatch[1];
    if (subdomain !== "www") {
      const url = req.nextUrl.clone();
      url.pathname = `/website/${subdomain}`;
      return NextResponse.rewrite(url);
    }
  }

  const token = req.cookies.get("token")?.value;
  const hasValidToken = token ? (await verifyAccessToken(token)) !== null : false;

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/audit") || pathname.startsWith("/admin")) {
    if (!hasValidToken) {
      return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(pathname)}`, req.url));
    }
  }

  if ((pathname === "/login" || pathname === "/register") && hasValidToken) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/audit/:path*", "/login", "/register", "/website/:path*", "/admin/:path*", "/"],
};
