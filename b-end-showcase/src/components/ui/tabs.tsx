import { cn } from "@/lib/utils"
import { createContext, useContext, useState, type HTMLAttributes, type ButtonHTMLAttributes } from "react"

const TabsContext = createContext<{ value: string; onChange: (v: string) => void }>({ value: "", onChange: () => {} })

interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  defaultValue: string
  value?: string
  onValueChange?: (v: string) => void
}

export function Tabs({ defaultValue, value: controlledValue, onValueChange, className, ...props }: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const value = controlledValue ?? internalValue
  const onChange = (v: string) => { setInternalValue(v); onValueChange?.(v) }
  return (
    <TabsContext.Provider value={{ value, onChange }}>
      <div className={cn("", className)} {...props} />
    </TabsContext.Provider>
  )
}

export function TabsList({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex h-9 items-center gap-0.5 rounded-lg bg-muted/70 p-1 text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

interface TabsTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

export function TabsTrigger({ value, className, ...props }: TabsTriggerProps) {
  const ctx = useContext(TabsContext)
  const active = ctx.value === value
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-[13px] font-medium transition-all duration-150 cursor-pointer select-none",
        active
          ? "bg-card text-foreground shadow-[var(--shadow-sm)]"
          : "text-muted-foreground hover:text-foreground/80",
        className
      )}
      onClick={() => ctx.onChange(value)}
      {...props}
    />
  )
}

interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string
}

export function TabsContent({ value, className, ...props }: TabsContentProps) {
  const ctx = useContext(TabsContext)
  if (ctx.value !== value) return null
  return <div className={cn("mt-3", className)} {...props} />
}
