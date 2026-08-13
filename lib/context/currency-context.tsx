"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { CurrencyCode } from "@/types";
import { convertFromUsd, formatMoney, getCurrency } from "@/lib/data/currencies";

interface CurrencyContextValue {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  convert: (amountUsd: number) => number;
  format: (amountUsd: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);
const STORAGE_KEY = "meridian_currency";

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("USD");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as CurrencyCode | null;
    if (stored) setCurrencyState(stored);
  }, []);

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    window.localStorage.setItem(STORAGE_KEY, code);
  };

  const value: CurrencyContextValue = {
    currency,
    setCurrency,
    convert: (amountUsd: number) => convertFromUsd(amountUsd, currency),
    format: (amountUsd: number) => formatMoney(amountUsd, currency),
  };

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}

export { getCurrency };
