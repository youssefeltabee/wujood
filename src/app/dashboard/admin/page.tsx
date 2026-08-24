"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, Badge, Tabs, TabPanel, Spinner } from "@/components/ui";

const dateFormatter = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" });

interface AdminUser {
  id: string;
  email: string;
  name?: string | null;
  companyName?: string | null;
  role: string;
  createdAt: string;
}

interface AdminPayment {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  user?: { email?: string | null } | null;
}

interface AdminStats {
  totalUsers: number;
  totalPayments: number;
  totalRevenue: number;
  activeSubscriptions: number;
  totalAudits: number;
}

async function fetchJson(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${url}`);
  return res.json();
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("stats");

  const meQuery = useQuery({ queryKey: ["me"], queryFn: () => fetchJson("/api/auth/me") });
  const isAdmin = meQuery.data?.user?.role === "admin";

  const usersQuery = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => fetchJson("/api/admin/users"),
    enabled: isAdmin,
  });
  const paymentsQuery = useQuery({
    queryKey: ["admin-payments"],
    queryFn: () => fetchJson("/api/admin/payments?limit=50"),
    enabled: isAdmin,
  });
  const statsQuery = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => fetchJson("/api/admin/stats"),
    enabled: isAdmin,
  });

  if (meQuery.isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  if (!isAdmin) {
    return (
      <div className="max-w-lg mx-auto px-6 py-20 text-center">
        <Card variant="elevated" padding="lg">
          <h1 className="text-2xl font-bold text-text-primary mb-2">Access Denied</h1>
          <p className="text-text-secondary">You do not have permission to access this page.</p>
        </Card>
      </div>
    );
  }

  const users: AdminUser[] = usersQuery.data?.users ?? [];
  const payments: AdminPayment[] = paymentsQuery.data?.payments ?? [];
  const stats: AdminStats | null = statsQuery.data ?? null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-text-primary mb-1">Admin Panel</h1>
      <p className="text-text-secondary mb-8">System management and overview.</p>

      <Tabs activeTab={activeTab} onTabChange={setActiveTab} tabs={[
        { value: "stats", label: "Stats" },
        { value: "users", label: "Users" },
        { value: "payments", label: "Payments" },
      ]} />

      <TabPanel value="stats" activeTab={activeTab}>
        {statsQuery.isLoading ? (
          <div className="flex justify-center py-10"><Spinner /></div>
        ) : stats ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Card variant="elevated" padding="md">
              <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">Total Users</p>
              <p className="text-3xl font-bold text-text-primary">{stats.totalUsers}</p>
            </Card>
            <Card variant="elevated" padding="md">
              <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">Total Payments</p>
              <p className="text-3xl font-bold text-text-primary">{stats.totalPayments}</p>
            </Card>
            <Card variant="elevated" padding="md">
              <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-text-primary">EGP {Number(stats.totalRevenue).toLocaleString()}</p>
            </Card>
            <Card variant="elevated" padding="md">
              <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">Active Subscriptions</p>
              <p className="text-3xl font-bold text-text-primary">{stats.activeSubscriptions}</p>
            </Card>
            <Card variant="elevated" padding="md">
              <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">Total Audits</p>
              <p className="text-3xl font-bold text-text-primary">{stats.totalAudits}</p>
            </Card>
          </div>
        ) : <p className="text-text-muted">Failed to load stats.</p>}
      </TabPanel>

      <TabPanel value="users" activeTab={activeTab}>
        {usersQuery.isLoading ? (
          <div className="flex justify-center py-10"><Spinner /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-subtle text-left text-text-secondary">
                  <th className="pb-3 pr-4">Email</th>
                  <th className="pb-3 pr-4">Name</th>
                  <th className="pb-3 pr-4">Company</th>
                  <th className="pb-3 pr-4">Role</th>
                  <th className="pb-3">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-border-subtle/50">
                    <td className="py-3 pr-4 text-text-primary">{u.email}</td>
                    <td className="py-3 pr-4 text-text-secondary">{u.name || "—"}</td>
                    <td className="py-3 pr-4 text-text-secondary">{u.companyName || "—"}</td>
                    <td className="py-3 pr-4">
                      <Badge variant={u.role === "admin" ? "success" : "info"}>{u.role}</Badge>
                    </td>
                    <td className="py-3 text-text-secondary">{dateFormatter.format(new Date(u.createdAt))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </TabPanel>

      <TabPanel value="payments" activeTab={activeTab}>
        {paymentsQuery.isLoading ? (
          <div className="flex justify-center py-10"><Spinner /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-subtle text-left text-text-secondary">
                  <th className="pb-3 pr-4">User</th>
                  <th className="pb-3 pr-4">Amount</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b border-border-subtle/50">
                    <td className="py-3 pr-4 text-text-primary">{p.user?.email || "—"}</td>
                    <td className="py-3 pr-4 text-text-primary">EGP {Number(p.amount).toLocaleString()}</td>
                    <td className="py-3 pr-4">
                      <Badge variant={p.status === "COMPLETED" ? "success" : p.status === "FAILED" ? "danger" : "warning"}>{p.status}</Badge>
                    </td>
                    <td className="py-3 text-text-secondary">{dateFormatter.format(new Date(p.createdAt))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </TabPanel>
    </div>
  );
}
