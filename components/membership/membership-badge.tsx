import { Crown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function MembershipBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-brand-gold-600 to-brand-gold-500 px-2.5 py-1 text-xs font-semibold text-white",
        className
      )}
    >
      <Crown className="size-3" /> Plus
    </span>
  );
}
