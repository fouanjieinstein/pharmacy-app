// lib/server/payment-utils.ts
import type { PaymentProvider, PaymentStatus } from "@/lib/generated/prisma";

// Frontend -> DB (for creating records)
export function paymentProviderToDb(provider: string): PaymentProvider {
  switch (provider) {
    case "stripe":
      return "STRIPE";
    case "flutterwave":
      return "FLUTTERWAVE";
    case "dpo-pay":
      return "DPO_PAY";
    default:
      return "STRIPE";
  }
}

export function paymentStatusToDb(status: string): PaymentStatus {
  switch (status) {
    case "succeeded":
      return "SUCCEEDED";
    case "failed":
      return "FAILED";
    case "pending":
      return "PENDING";
    case "refunded":
      return "REFUNDED";
    default:
      return "SUCCEEDED";
  }
}

// DB -> Frontend (for serializing)
export function paymentProviderFromDb(provider: PaymentProvider): string {
  switch (provider) {
    case "STRIPE":
      return "stripe";
    case "FLUTTERWAVE":
      return "flutterwave";
    case "DPO_PAY":
      return "dpo-pay";
    default:
      return "stripe";
  }
}

export function paymentStatusFromDb(status: PaymentStatus): string {
  switch (status) {
    case "SUCCEEDED":
      return "succeeded";
    case "FAILED":
      return "failed";
    case "PENDING":
      return "pending";
    case "REFUNDED":
      return "refunded";
    default:
      return "succeeded";
  }
}