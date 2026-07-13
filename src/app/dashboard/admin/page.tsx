"use client";

import { useEffect, useState } from "react";
import { Card, Badge, Tabs, TabPanel, Spinner, useToast } from "@/components/ui";

const dateFormatter = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" });

export default function AdminPage() {
  const { toast } = useToast();
  const [checking, setChecking] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState({ users: true, payments: true, stats: true });

  useEffect(() => {
    fetch("/api/auth/me").then(async (r) => {
      if (!r.ok) { setAccessDenied(true); setChecking(false); return; }
      const data = await r.json();
      if (data.user?.role !== "admin") { setAccessDenied(true); setChecking(false); return; }
      setChecking(false);
    });
  }, []);

  useEffect(() => {
    if (checking || accessDenied) return;
    fetch("/api/admin/users").then(async (r) => {
      if (r.ok) { const d = await r.json(); setUsers(d.users); }
      setLoading((p) => ({ ...p, users: false }));
    }).catch(() => setLoading((p) => ({ ...p, users: false })));
    fetch("/api/admin/payments?limit=50").then(async (r) => {
      if (r.ok) { const d = await r.json(); setPayments(d.payments); }
      setLoading((p) => ({ ...p, payments: false }));
    }).catch(() => setLoading((p) => ({ ...p, payments: false })));
    fetch("/api/admin/stats").then(async (r) => {
      if (r.ok) { const d = await r.json(); setStats(d); }
      setLoading((p) => ({ ...p, stats: false }));
    }).catch(() => setLoading((p) => ({ ...p, stats: false })));
  }, [checking, accessDenied]);

  if (checking) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  if (accessDenied) {
    return (
      <div className="max-w-lg mx-auto px-6 py-20 text-center">
        <Card variant="elevated" padding="lg">
          <h1 className="text-2xl font-bold text-text-primary mb-2">Access Denied</h1>
          <p className="text-text-secondary">You do not have permission to access this page.</p>
        </Card>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState("stats");

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
        {loading.stats ? (
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
        {loading.users ? (
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
                {users.map((u: any) => (
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
        {loading.payments ? (
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
                {payments.map((p: any) => (
                  <tr key={p.id} className="border-b border-border-subtle/50">
                    <td className="py-3 pr-4 text-text-primary">{p.user?.email || "—"}</td>
                    <td className="py-3 pr-4 text-text-primary">EGP {Number(p.amount).toLocaleString()}</td>
                    <td className="py-3 pr-4">
                      <Badge variant={p.status === "completed" ? "success" : p.status === "failed" ? "danger" : "warning"}>{p.status}</Badge>
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
