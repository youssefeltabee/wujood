"use client";

// ponytail: Toaster moved to root Providers — keep wrapper for dashboard-specific client state
export default function DashboardClientWrapper({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
