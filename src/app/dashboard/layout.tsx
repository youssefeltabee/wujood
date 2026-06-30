import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[#1e3a5f]">Wujood</Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
            <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
          </div>
        </div>
      </nav>
      <main className="flex-1">{children}</main>
    </>
  );
}
