import { cn } from "@/lib/utils"
import { HTMLAttributes, forwardRef } from "react"

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info"

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-gray-100 text-gray-700",
  success: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-700",
  danger: "bg-red-100 text-red-700",
  info: "bg-blue-100 text-blue-700",
}

export const Badge = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }>(({ className, variant = "default", ...props }, ref) => (
  <span ref={ref} className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", variantStyles[variant], className)} {...props} />
))
Badge.displayName = "Badge"
