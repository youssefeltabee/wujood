import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

async function dnsResolve(host: string): Promise<string[]> {
  try {
    const { Resolver } = await import("dns/promises");
    const resolver = new Resolver();
    const [a, aaaa] = await Promise.allSettled([
      resolver.resolve4(host),
      resolver.resolve6(host),
    ]);
    const out: string[] = [];
    if (a.status === "fulfilled") out.push(...a.value.map((ip: string) => `A:${ip}`));
    if (aaaa.status === "fulfilled") out.push(...aaaa.value.map((ip: string) => `AAAA:${ip}`));
    return out;
  } catch { return ["dns-error"]; }
}

export async function GET() {
  const result: Record<string, unknown> = {};
  result.hasDatabaseUrl = !!process.env.DATABASE_URL;
  result.hasDirectUrl = !!process.env.DIRECT_URL;
  result.dbUrl = process.env.DATABASE_URL?.replace(/\/\/.*@/, "//user:pass@");

  try {
    const host = "db.ngriuxznvlgmbwhzpcpi.supabase.co";
    result.dns = await dnsResolve(host);
  } catch { result.dns = "dns-error"; }

  try {
    const directUrl = process.env.DIRECT_URL;
    if (directUrl) {
      const host = new URL(directUrl).hostname;
      const port = new URL(directUrl).port || "5432";
      const { connect } = await import("net");
      result.tcpCheck = await new Promise((resolve) => {
        const sock = connect(parseInt(port), host, () => {
          sock.destroy();
          resolve("ok");
        });
        sock.on("error", (e: NodeJS.ErrnoException) => resolve(`fail: ${e.message}`));
        sock.setTimeout(5000, () => { sock.destroy(); resolve("timeout"); });
      });
    }
  } catch (e: unknown) { result.tcpCheck = e instanceof Error ? e.message : String(e); }

  try {
    const poolUrl = process.env.DATABASE_URL;
    if (poolUrl) {
      const host = new URL(poolUrl).hostname;
      const port = new URL(poolUrl).port || "6543";
      const { connect } = await import("net");
      result.tcpPoolCheck = await new Promise((resolve) => {
        const sock = connect(parseInt(port), host, () => {
          sock.destroy();
          resolve("ok");
        });
        sock.on("error", (e: NodeJS.ErrnoException) => resolve(`fail: ${e.message}`));
        sock.setTimeout(5000, () => { sock.destroy(); resolve("timeout"); });
      });
    }
  } catch (e: unknown) { result.tcpPoolCheck = e instanceof Error ? e.message : String(e); }

  try {
    const posts = await prisma.blogPost.findMany({ take: 1 });
    result.postCount = posts.length;
    result.status = "ok";
  } catch (e: unknown) {
    result.status = "prisma-error";
    result.error = e instanceof Error ? e.message.split("\n")[0] : String(e);
    result.errorName = e instanceof Error ? e.name : typeof e;
  }

  return NextResponse.json(result);
}
