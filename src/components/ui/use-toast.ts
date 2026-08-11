"use client"

import { toast as sonnerToast, type ExternalToast } from "sonner"

type ToastVariant = "success" | "error" | "warning" | "info"

function useToast() {
  const toast = (message: string, variant: ToastVariant = "info", duration?: number) => {
    const options: ExternalToast = { duration: duration ?? 4000 }
    switch (variant) {
      case "success":
        sonnerToast.success(message, options)
        break
      case "error":
        sonnerToast.error(message, options)
        break
      case "warning":
        sonnerToast.warning(message, options)
        break
      default:
        sonnerToast.info(message, options)
        break
    }
  }

  return { toast }
}

export { useToast }
export type { ToastVariant }
