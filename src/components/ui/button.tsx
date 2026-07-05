import { forwardRef, ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { variant?: "primary" | "secondary" | "outline" | "ghost" | "brand"; size?: "sm" | "md" | "lg" }

const variants = {
  primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm",
  secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
  outline: "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50",
  ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
  brand: "ghost-gradient text-white hover:opacity-90 shadow-md",
}

const sizes = { sm: "px-3 py-1.5 text-sm", md: "px-5 py-2.5 text-sm", lg: "px-7 py-3 text-base" }

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = "primary", size = "md", disabled, children, ...props }, ref) => (
  <button ref={ref} disabled={disabled} className={cn("inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer", variants[variant], sizes[size], className)} {...props}>
    {children}
  </button>
))
Button.displayName = "Button"
