import Link from "next/link";
import { Cross } from "lucide-react";

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="Meridian Health home">
      <span
        className={
          inverted
            ? "flex size-8 items-center justify-center rounded-sm bg-white text-brand-navy-900"
            : "flex size-8 items-center justify-center rounded-sm bg-brand-navy-900 text-white"
        }
      >
        <Cross className="size-4.5" strokeWidth={2.5} />
      </span>
      <span className={inverted ? "font-display text-lg tracking-tight text-white" : "font-display text-lg tracking-tight text-brand-navy-900"}>
        Meridian <span className="font-normal text-brand-emerald-600">Health</span>
      </span>
    </Link>
  );
}
