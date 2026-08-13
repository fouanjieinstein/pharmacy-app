import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type BadgeVariant = "emerald" | "gold" | "navy" | "gray" | "red" | "outline";

export function Badge({
  children,
  variant = "gray",
  className,
  icon,
}: {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
  icon?: ReactNode;
}) {
  const styles: Record<BadgeVariant, string> = {
    emerald: "bg-brand-emerald-50 text-brand-emerald-700 ring-1 ring-inset ring-brand-emerald-100",
    gold: "bg-brand-gold-50 text-brand-gold-700 ring-1 ring-inset ring-brand-gold-100",
    navy: "bg-brand-navy-900 text-white",
    gray: "bg-brand-gray-100 text-brand-gray-700 ring-1 ring-inset ring-brand-gray-200",
    red: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-100",
    outline: "border border-brand-gray-300 text-brand-navy-900",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        styles[variant],
        className
      )}
    >
      {icon}
      {children}
    </span>
  );
}
