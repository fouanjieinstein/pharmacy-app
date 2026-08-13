"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { CountryCode } from "@/types";
import { countries, getCountry } from "@/lib/data/countries";

interface CountryContextValue {
  countryCode: CountryCode;
  setCountryCode: (code: CountryCode) => void;
  country: ReturnType<typeof getCountry>;
}

const CountryContext = createContext<CountryContextValue | null>(null);
const STORAGE_KEY = "meridian_country";

export function CountryProvider({ children }: { children: ReactNode }) {
  const [countryCode, setCountryCodeState] = useState<CountryCode>("IN");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as CountryCode | null;
    if (stored && countries.some((c) => c.code === stored)) setCountryCodeState(stored);
  }, []);

  const setCountryCode = (code: CountryCode) => {
    setCountryCodeState(code);
    window.localStorage.setItem(STORAGE_KEY, code);
  };

  return (
    <CountryContext.Provider
      value={{ countryCode, setCountryCode, country: getCountry(countryCode) }}
    >
      {children}
    </CountryContext.Provider>
  );
}

export function useCountry() {
  const ctx = useContext(CountryContext);
  if (!ctx) throw new Error("useCountry must be used within CountryProvider");
  return ctx;
}
