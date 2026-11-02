import { cn } from "@/lib/utils"
import type { HTMLAttributes } from "react"

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/60 bg-card text-card-foreground shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]",
        className
      )}
      {...props}
    />
  )
}

export function CardHeader({ className, style, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("card-header flex flex-col space-y-1.5", className)} style={{ padding: '20px 20px 8px', ...style }} {...props} />
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-[15px] font-semibold leading-none tracking-tight text-foreground", className)} {...props} />
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-muted-foreground leading-relaxed", className)} {...props} />
}

export function CardContent({ className, style, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("card-content", className)} style={{ padding: '20px', ...style }} {...props} />
}
