"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import DashboardClientWrapper from "@/components/DashboardClientWrapper";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
}

const NAV_GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: "Overview",
    items: [{ href: "/dashboard", label: "Business Pulse" }],
  },
  {
    label: "Tools",
    items: [
      { href: "/dashboard/catalog", label: "Catalog" },
      { href: "/dashboard/website", label: "Website" },
      { href: "/dashboard/social", label: "Social" },
      { href: "/dashboard/chat", label: "AI Chat" },
      { href: "/dashboard/whatsapp", label: "WhatsApp" },
    ],
  },
  {
    label: "Account",
    items: [
      { href: "/dashboard/subscription", label: "Subscription" },
      { href: "/dashboard/blog", label: "Blog" },
      { href: "/dashboard/onboarding", label: "Setup" },
    ],
  },
];

function isActive(pathname: string, href: string) {
  return href === "/dashboard" ? pathname === href : pathname.startsWith(href);
}

function NavGroups({
  pathname,
  isAdmin,
  onNavigate,
}: {
  pathname: string;
  isAdmin: boolean;
  onNavigate?: () => void;
}) {
  const groups = isAdmin
    ? [...NAV_GROUPS, { label: "Admin", items: [{ href: "/dashboard/admin", label: "Control Room" }] }]
    : NAV_GROUPS;

  return (
    <nav className="flex flex-col gap-8 px-3" aria-label="Dashboard">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="px-3 pb-2 text-xs uppercase tracking-widest text-text-muted">{group.label}</p>
          <ul className="space-y-1">
            {group.items.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "focus-ring-gold relative block rounded-lg px-3 py-2 text-sm transition-colors",
                      active
                        ? "before:absolute before:inset-y-1 before:start-0 before:w-0.5 before:rounded-full before:bg-accent-gold text-white"
                        : "text-text-secondary hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function UserBlock({
  user,
  onLogout,
}: {
  user: { name?: string | null; email?: string | null } | null;
  onLogout: () => void;
}) {
  return (
    <div className="border-t border-border-subtle p-4">
      <p className="truncate text-sm font-medium text-text-primary">{user?.name || user?.email || "Signed in"}</p>
      {user?.name && user?.email && <p className="truncate text-xs text-text-muted">{user.email}</p>}
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={onLogout}
          className="focus-ring-gold inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-border-subtle px-3 py-2 text-xs text-text-secondary transition-colors hover:bg-bg-elevated hover:text-white"
        >
          <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
          </svg>
          Log out
        </button>
        <Link
          href="/"
          className="focus-ring-gold rounded-lg px-2 py-2 text-xs text-text-muted transition-colors hover:text-text-secondary"
          title="Back to site"
        >
          Home
        </Link>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<{ name?: string | null; email?: string | null } | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/auth/me").then(async (r) => {
      if (r.ok) {
        const d = await r.json();
        setIsAdmin(d.user?.role === "admin");
        setUser({ name: d.user?.name, email: d.user?.email });
      }
    }).catch(() => {});
  }, []);

  const handleLogout = async () => {
    try { await fetch("/api/auth/logout", { method: "POST" }); } catch { /* ponytail: best-effort logout, client cookie expiry handles the rest */ }
    window.location.href = "/login";
  };

  return (
    <DashboardClientWrapper>
      <div className="min-h-dvh bg-bg-primary">
        {/* Desktop sidebar */}
        <aside className="fixed inset-y-0 start-0 z-40 hidden w-64 flex-col border-e border-border-subtle bg-bg-surface md:flex">
          <div className="flex h-16 shrink-0 items-center border-b border-border-subtle px-5">
            <Logo />
          </div>
          <div className="flex-1 overflow-y-auto py-6">
            <NavGroups pathname={pathname} isAdmin={isAdmin} />
          </div>
          <UserBlock user={user} onLogout={handleLogout} />
        </aside>

        {/* Mobile top bar */}
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border-subtle bg-bg-surface/95 px-4 backdrop-blur-sm md:hidden">
          <Logo />
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={drawerOpen}
            className="focus-ring-gold rounded-lg p-2 text-text-secondary transition-colors hover:bg-bg-elevated hover:text-white"
          >
            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </header>

        {/* Mobile drawer */}
        {drawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
            <div className="absolute inset-0 bg-bg-overlay" onClick={() => setDrawerOpen(false)} />
            <aside className="animate-push-in absolute inset-y-0 start-0 flex w-72 max-w-[85vw] flex-col border-e border-border-subtle bg-bg-surface">
              <div className="flex h-14 shrink-0 items-center justify-between border-b border-border-subtle px-4">
                <Logo />
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close navigation menu"
                  className="focus-ring-gold rounded-lg p-2 text-text-secondary transition-colors hover:bg-bg-elevated hover:text-white"
                >
                  <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-6">
                <NavGroups pathname={pathname} isAdmin={isAdmin} onNavigate={() => setDrawerOpen(false)} />
              </div>
              <UserBlock user={user} onLogout={handleLogout} />
            </aside>
          </div>
        )}

        <main className="md:ms-64">{children}</main>
      </div>
    </DashboardClientWrapper>
  );
}
