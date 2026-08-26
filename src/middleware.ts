import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/jwt";

export async function middleware(req: NextRequest) {
  const { pathname, hostname } = req.nextUrl;

  // ponytail: locale cookie — server renders the right language on first byte (kills hydration flash)
  if (!req.cookies.get("wujood-locale")) {
    const locale = (req.headers.get("accept-language") ?? "").toLowerCase().startsWith("ar") ? "ar" : "en";
    const res = NextResponse.next();
    res.cookies.set("wujood-locale", locale, { path: "/", maxAge: 31536000, sameSite: "lax" });
    return res;
  }

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
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|mjs|woff2?|txt|xml)$).*)"],
};
