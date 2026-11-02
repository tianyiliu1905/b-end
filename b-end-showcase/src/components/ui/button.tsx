import { cn } from "@/lib/utils"
import type { ButtonHTMLAttributes } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

export function Button({ className, variant = "default", size = "default", ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none"
  const variants: Record<string, string> = {
    default: "bg-primary text-primary-foreground shadow-[var(--shadow-xs)] hover:bg-primary/90 active:scale-[0.98]",
    destructive: "bg-destructive text-destructive-foreground shadow-[var(--shadow-xs)] hover:bg-destructive/90 active:scale-[0.98]",
    outline: "border border-border bg-card hover:bg-accent hover:border-border/80 active:scale-[0.98] shadow-[var(--shadow-xs)]",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-[0.98]",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  }
  const sizes: Record<string, string> = {
    default: "h-9 px-4 py-2",
    sm: "h-8 rounded-lg px-3 text-[13px]",
    lg: "h-11 rounded-lg px-6",
    icon: "h-9 w-9",
  }
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />
}
