import type { Currency, CurrencyCode } from "@/types";

// MOCK exchange rates for prototype display purposes only.
// A production backend must source live, licensed FX rates
// (e.g. via the payment provider or a dedicated FX API) and
// perform all real currency conversion server-side.
export const currencies: Currency[] = [
  { code: "USD", symbol: "$", name: "US Dollar", rateToUsd: 1 },
  { code: "EUR", symbol: "€", name: "Euro", rateToUsd: 0.92 },
  { code: "GBP", symbol: "£", name: "British Pound", rateToUsd: 0.79 },
  { code: "CAD", symbol: "CA$", name: "Canadian Dollar", rateToUsd: 1.37 },
  { code: "INR", symbol: "₹", name: "Indian Rupee", rateToUsd: 83.4 },
  { code: "AED", symbol: "AED", name: "UAE Dirham", rateToUsd: 3.67 },
  { code: "XAF", symbol: "FCFA", name: "Central African CFA Franc", rateToUsd: 607.5 },
];

export function getCurrency(code: CurrencyCode): Currency {
  return currencies.find((c) => c.code === code) ?? currencies[0];
}

export function convertFromUsd(amountUsd: number, code: CurrencyCode): number {
  return amountUsd * getCurrency(code).rateToUsd;
}

export function formatMoney(amountUsd: number, code: CurrencyCode): string {
  const currency = getCurrency(code);
  const converted = convertFromUsd(amountUsd, code);
  const decimals = code === "XAF" ? 0 : 2;
  const formatted = converted.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${currency.symbol}${formatted}`;
}
