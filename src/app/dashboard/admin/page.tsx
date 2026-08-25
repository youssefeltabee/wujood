"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge, Tabs, TabPanel, Skeleton } from "@/components/ui";
import { EmptyState, PageHeader } from "../_components/chrome";

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

function StatTile({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="card-lux p-5">
      <p className="mb-1 text-xs uppercase tracking-widest text-text-secondary">{label}</p>
      <p className="stat-value text-3xl font-bold text-text-primary">{value}</p>
    </div>
  );
}

function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div aria-hidden="true">
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} variant="card" className="skeleton mb-2 !h-auto h-12 rounded-lg" />
      ))}
    </div>
  );
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

  if (meQuery.isLoading) {
    return (
      <div className="mx-auto w-full max-w-5xl px-6 py-10" aria-hidden="true">
        <div className="skeleton mb-2 h-4 w-24 rounded" />
        <div className="skeleton mb-8 h-9 w-56 rounded-lg" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} variant="card" className="skeleton h-[104px] rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto w-full max-w-lg px-6 py-20">
        <EmptyState
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          }
          title="Access Denied"
          hint="You do not have permission to access this page."
        />
      </div>
    );
  }

  const users: AdminUser[] = usersQuery.data?.users ?? [];
  const payments: AdminPayment[] = paymentsQuery.data?.payments ?? [];
  const stats: AdminStats | null = statsQuery.data ?? null;

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <PageHeader
        eyebrow="Control Room"
        title="Admin Panel"
        subtitle="System management and overview."
      />

      <Tabs activeTab={activeTab} onTabChange={setActiveTab} tabs={[
        { value: "stats", label: "Stats" },
        { value: "users", label: "Users" },
        { value: "payments", label: "Payments" },
      ]} />

      <TabPanel value="stats" activeTab={activeTab}>
        {statsQuery.isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3" aria-hidden="true">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} variant="card" className="skeleton h-[104px] rounded-2xl" />
            ))}
          </div>
        ) : stats ? (
          <div className="animate-stagger grid grid-cols-2 gap-4 md:grid-cols-3">
            <StatTile label="Total Users" value={stats.totalUsers} />
            <StatTile label="Total Payments" value={stats.totalPayments} />
            <StatTile label="Total Revenue" value={<><span className="text-base text-text-secondary">EGP </span>{Number(stats.totalRevenue).toLocaleString()}</>} />
            <StatTile label="Active Subscriptions" value={stats.activeSubscriptions} />
            <StatTile label="Total Audits" value={stats.totalAudits} />
          </div>
        ) : (
          <EmptyState
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            }
            title="Failed to load stats"
            hint="The metrics service did not respond. Try again shortly."
          />
        )}
      </TabPanel>

      <TabPanel value="users" activeTab={activeTab}>
        {usersQuery.isLoading ? (
          <TableSkeleton />
        ) : users.length === 0 ? (
          <EmptyState
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            }
            title="No users yet"
            hint="New signups will appear here."
          />
        ) : (
          <div className="card-lux overflow-hidden hover:translate-y-0">
            <div className="overflow-x-auto">
              <table className="table-lux w-full text-sm">
                <thead>
                  <tr>
                    <th scope="col" className="px-6 pb-3 pt-5 text-start font-medium">Email</th>
                    <th scope="col" className="px-6 pb-3 pt-5 text-start font-medium">Name</th>
                    <th scope="col" className="px-6 pb-3 pt-5 text-start font-medium">Company</th>
                    <th scope="col" className="px-6 pb-3 pt-5 text-start font-medium">Role</th>
                    <th scope="col" className="px-6 pb-3 pt-5 text-start font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="px-6 text-text-primary">{u.email}</td>
                      <td className="px-6 text-text-secondary">{u.name || "—"}</td>
                      <td className="px-6 text-text-secondary">{u.companyName || "—"}</td>
                      <td className="px-6">
                        <Badge variant={u.role === "admin" ? "success" : "info"} size="sm">{u.role}</Badge>
                      </td>
                      <td className="whitespace-nowrap px-6 text-text-secondary">{dateFormatter.format(new Date(u.createdAt))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </TabPanel>

      <TabPanel value="payments" activeTab={activeTab}>
        {paymentsQuery.isLoading ? (
          <TableSkeleton />
        ) : payments.length === 0 ? (
          <EmptyState
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
              </svg>
            }
            title="No payments yet"
            hint="Transactions will land here as customers check out."
          />
        ) : (
          <div className="card-lux overflow-hidden hover:translate-y-0">
            <div className="overflow-x-auto">
              <table className="table-lux w-full text-sm">
                <thead>
                  <tr>
                    <th scope="col" className="px-6 pb-3 pt-5 text-start font-medium">User</th>
                    <th scope="col" className="px-6 pb-3 pt-5 text-start font-medium">Amount</th>
                    <th scope="col" className="px-6 pb-3 pt-5 text-start font-medium">Status</th>
                    <th scope="col" className="px-6 pb-3 pt-5 text-start font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id}>
                      <td className="px-6 text-text-primary">{p.user?.email || "—"}</td>
                      <td className="stat-value whitespace-nowrap px-6 text-text-primary">EGP {Number(p.amount).toLocaleString()}</td>
                      <td className="px-6">
                        <Badge variant={p.status === "COMPLETED" ? "success" : p.status === "FAILED" ? "danger" : "warning"} size="sm">{p.status}</Badge>
                      </td>
                      <td className="whitespace-nowrap px-6 text-text-secondary">{dateFormatter.format(new Date(p.createdAt))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </TabPanel>
    </div>
  );
}
