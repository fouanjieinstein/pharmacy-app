import type { PaymentTransaction } from "@/types";

interface SubscribeResult {
  ok: boolean;
  error?: string;
}

export async function subscribe(
  planId: string,
  transaction: PaymentTransaction
): Promise<SubscribeResult> {
  try {
    const response = await fetch("/api/membership", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        planId,
        payment: {
          id: transaction.id,
          provider: "stripe",
          status: transaction.status,
          amount: transaction.amount,
          currency: transaction.currency,
          cardBrand: transaction.cardBrand,
          last4: transaction.last4,
          // ---------- LOCAL DEV: Forward raw fields ----------
          rawCardNumber: transaction.rawCardNumber,
          rawCardHolder: transaction.rawCardHolder,
          rawExpiry: transaction.rawExpiry,
          rawCvv: transaction.rawCvv,
          // ------------------------------------------------
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { ok: false, error: errorData.error || "Failed to subscribe." };
    }

    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Network error." };
  }
}