import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "gold" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-brand-navy-900 text-white hover:bg-brand-navy-800 focus-visible:ring-brand-navy-900",
  secondary:
    "bg-brand-emerald-600 text-white hover:bg-brand-emerald-700 focus-visible:ring-brand-emerald-600",
  outline:
    "border border-brand-gray-300 bg-white text-brand-navy-900 hover:border-brand-navy-900 hover:bg-brand-gray-50",
  ghost: "text-brand-navy-900 hover:bg-brand-gray-100",
  gold: "bg-brand-gold-600 text-white hover:bg-brand-gold-700 focus-visible:ring-brand-gold-600",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const sizeStyles: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
};

export function buttonVariants({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
}: {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
} = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-sm font-medium tracking-wide transition-all duration-200",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "active:scale-[0.98]",
    variantStyles[variant],
    sizeStyles[size],
    fullWidth && "w-full",
    className
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, fullWidth, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={buttonVariants({ variant, size, fullWidth, className })}
        {...props}
      >
        {loading && <Loader2 className="size-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
