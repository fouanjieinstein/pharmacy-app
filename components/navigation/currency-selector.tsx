"use client";

import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useCurrency } from "@/lib/context/currency-context";
import { currencies } from "@/lib/data/currencies";
import { useClickOutside } from "@/lib/utils/use-click-outside";
import { cn } from "@/lib/utils/cn";

export function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false));

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1 rounded-sm px-2 py-1.5 text-sm font-medium text-brand-navy-900 hover:bg-brand-gray-100"
      >
        {currency}
        <ChevronDown className="size-3.5 text-brand-gray-500" />
      </button>
      {open && (
        <div
          role="listbox"
          className="absolute right-0 z-50 mt-2 w-48 rounded-md border border-brand-gray-200 bg-white py-1.5 shadow-lg animate-fade-in"
        >
          {currencies.map((c) => (
            <button
              key={c.code}
              role="option"
              aria-selected={currency === c.code}
              onClick={() => {
                setCurrency(c.code);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between px-3.5 py-2 text-left text-sm hover:bg-brand-gray-50",
                currency === c.code && "font-semibold text-brand-emerald-700"
              )}
            >
              <span>
                {c.code} <span className="text-brand-gray-500">— {c.name}</span>
              </span>
              <span className="text-brand-gray-400">{c.symbol}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
