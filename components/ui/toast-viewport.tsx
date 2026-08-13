"use client";

import { CheckCircle2, AlertTriangle, Info, XCircle, X } from "lucide-react";
import { useToast } from "@/lib/context/toast-context";
import { cn } from "@/lib/utils/cn";

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const styles = {
  success: "border-brand-emerald-200 bg-brand-emerald-50 text-brand-emerald-700",
  error: "border-red-200 bg-red-50 text-red-700",
  info: "border-brand-navy-200 bg-white text-brand-navy-900",
  warning: "border-brand-gold-200 bg-brand-gold-50 text-brand-gold-700",
};

export function ToastViewport() {
  const { toasts, dismissToast } = useToast();

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-4 right-4 z-200 flex w-full max-w-sm flex-col gap-2"
    >
      {toasts.map((toast) => {
        const Icon = icons[toast.type];
        return (
          <div
            key={toast.id}
            role="status"
            className={cn(
              "pointer-events-auto flex items-start gap-2.5 rounded-md border px-4 py-3 shadow-lg animate-slide-up",
              styles[toast.type]
            )}
          >
            <Icon className="size-5 shrink-0" />
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="shrink-0 opacity-60 hover:opacity-100"
            >
              <X className="size-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
