import { cn } from "@/lib/utils"
import type { HTMLAttributes } from "react"

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning"
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const base = "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium leading-4 transition-colors"
  const variants: Record<string, string> = {
    default: "border-transparent bg-primary/10 text-primary",
    secondary: "border-transparent bg-secondary text-secondary-foreground",
    destructive: "border-transparent bg-red-50 text-red-600",
    outline: "border-border text-foreground",
    success: "border-transparent bg-emerald-50 text-emerald-700",
    warning: "border-transparent bg-amber-50 text-amber-700",
  }
  return <div className={cn(base, variants[variant], className)} {...props} />
}
