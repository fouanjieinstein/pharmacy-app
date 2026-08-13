import type { SavedPaymentMethod } from "@/types";

// MOCK saved payment methods. Only tokenized/non-sensitive metadata (brand,
// last 4 digits, expiry, provider token reference) is ever persisted here —
// never a raw card number or CVV. See lib/services/payment-service.ts for
// the real-provider integration boundary.

const STORAGE_KEY = "meridian_payment_methods";

function readStore(): SavedPaymentMethod[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function writeStore(methods: SavedPaymentMethod[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(methods));
}

export function listPaymentMethods(): SavedPaymentMethod[] {
  return readStore();
}

function detectBrand(cardNumber: string): SavedPaymentMethod["brand"] {
  const digits = cardNumber.replace(/\D/g, "");
  if (digits.startsWith("4")) return "visa";
  if (/^5[1-5]/.test(digits)) return "mastercard";
  if (/^3[47]/.test(digits)) return "amex";
  return "rupay";
}

export function addPaymentMethodFromCardInput(input: {
  cardNumber: string;
  expiryMonth: number;
  expiryYear: number;
}): SavedPaymentMethod {
  const digits = input.cardNumber.replace(/\D/g, "");
  const record: SavedPaymentMethod = {
    id: `pm_${Date.now().toString(36)}`,
    provider: "stripe",
    brand: detectBrand(input.cardNumber),
    last4: digits.slice(-4),
    expiryMonth: input.expiryMonth,
    expiryYear: input.expiryYear,
    token: `tok_mock_${Math.random().toString(36).slice(2, 12)}`,
    isDefault: readStore().length === 0,
  };
  const methods = readStore();
  methods.unshift(record);
  writeStore(methods);
  return record;
}

export function removePaymentMethod(id: string): void {
  writeStore(readStore().filter((m) => m.id !== id));
}
