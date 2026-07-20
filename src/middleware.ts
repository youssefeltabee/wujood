import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname, hostname } = req.nextUrl;

  const subdomainMatch = hostname.match(/^(.+)\.wujood-app\.vercel\.app$/);
  if (subdomainMatch) {
    const subdomain = subdomainMatch[1];
    if (subdomain !== "www") {
      const url = req.nextUrl.clone();
      url.pathname = `/website/${subdomain}`;
      return NextResponse.rewrite(url);
    }
  }

  const hasToken = !!req.cookies.get("token")?.value;

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/audit") || pathname.startsWith("/admin")) {
    if (!hasToken) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  if ((pathname === "/login" || pathname === "/register") && hasToken) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/audit/:path*", "/login", "/register", "/website/:path*", "/admin/:path*", "/"],
};
