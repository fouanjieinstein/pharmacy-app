"use client";

import { useRef, useState } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { useCountry } from "@/lib/context/country-context";
import { countries } from "@/lib/data/countries";
import { useClickOutside } from "@/lib/utils/use-click-outside";
import { cn } from "@/lib/utils/cn";

export function CountrySelector() {
  const { countryCode, setCountryCode, country } = useCountry();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false));

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-sm px-2 py-1.5 text-sm font-medium text-brand-navy-900 hover:bg-brand-gray-100"
      >
        <Globe className="size-3.5 text-brand-gray-500" />
        {country.code}
        <ChevronDown className="size-3.5 text-brand-gray-500" />
      </button>
      {open && (
        <div
          role="listbox"
          className="scrollbar-thin absolute right-0 z-50 mt-2 max-h-80 w-64 overflow-y-auto rounded-md border border-brand-gray-200 bg-white py-1.5 shadow-lg animate-fade-in"
        >
          <p className="px-3.5 pb-1.5 pt-1 text-xs font-medium uppercase tracking-wide text-brand-gray-500">
            Ship to
          </p>
          {countries.map((c) => (
            <button
              key={c.code}
              role="option"
              aria-selected={countryCode === c.code}
              onClick={() => {
                setCountryCode(c.code);
                setOpen(false);
              }}
              className={cn(
                "flex w-full flex-col px-3.5 py-2 text-left text-sm hover:bg-brand-gray-50",
                countryCode === c.code && "bg-brand-emerald-50/60"
              )}
            >
              <span className={cn("font-medium", countryCode === c.code && "text-brand-emerald-700")}>{c.name}</span>
              <span className="text-xs text-brand-gray-500">{c.region}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
