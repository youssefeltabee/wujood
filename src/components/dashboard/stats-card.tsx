import { cn } from "@/lib/utils"

interface StatsCardProps { title: string; value: string | number; icon?: React.ReactNode; trend?: { value: number; positive: boolean }; className?: string }

export function StatsCard({ title, value, icon, trend, className }: StatsCardProps) {
  return (
    <div className={cn("rounded-2xl border border-gray-100 bg-white p-6 shadow-sm", className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        {icon && <div className="text-indigo-600">{icon}</div>}
      </div>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      {trend && (
        <p className={cn("mt-1 text-sm", trend.positive ? "text-green-600" : "text-red-600")}>
          {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}%
        </p>
      )}
    </div>
  )
}
