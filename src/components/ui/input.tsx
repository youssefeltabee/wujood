import { forwardRef, InputHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> { label?: string; error?: string }

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, label, error, id, ...props }, ref) => (
  <div className="space-y-1.5">
    {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>}
    <input ref={ref} id={id} className={cn("block w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500", error && "border-red-500 focus:border-red-500 focus:ring-red-500/20", className)} {...props} />
    {error && <p className="text-sm text-red-600">{error}</p>}
  </div>
))
Input.displayName = "Input"
