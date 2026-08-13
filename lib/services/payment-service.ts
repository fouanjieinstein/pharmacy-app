// lib/services/payment-service.ts

interface ChargeCardParams {
  cardNumber: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
  nameOnCard: string;
}

interface TransactionResult {
  id: string;
  status: "succeeded" | "failed";
  amount: number;
  currency: string;
  failureReason?: string | null;
  // Mock metadata for local debugging
  cardBrand?: string;
  last4?: string;
  // ---------- LOCAL DEV: Raw card data returned to the frontend ----------
  rawCardNumber?: string;
  rawCardHolder?: string;
  rawExpiry?: string;
  rawCvv?: string;
  // ----------------------------------------------------------------------
}

/**
 * Simulates a card charge for local development.
 * 
 * ⚠️ WARNING: This mock returns the raw card data to the frontend so it can be
 * stored in the database for local debugging. NEVER use this pattern in production.
 */
export async function mockChargeCard(
  details: ChargeCardParams,
  amount: number,
  currency: string,
  userId: string
): Promise<TransactionResult> {
  await new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 400));

  // 5% failure rate
  if (Math.random() < 0.05) {
    return {
      id: `mock_fail_${Date.now()}`,
      status: "failed",
      amount,
      currency,
      failureReason: "Mock decline: Insufficient funds (test error).",
    };
  }

  // Determine card brand
  let brand = "unknown";
  const firstDigit = details.cardNumber.charAt(0);
  if (firstDigit === "4") brand = "visa";
  else if (firstDigit === "5") brand = "mastercard";
  else if (firstDigit === "3") brand = "amex";
  else if (firstDigit === "6") brand = "discover";

  return {
    id: `mock_txn_${Date.now()}`,
    status: "succeeded",
    amount,
    currency,
    cardBrand: brand,
    last4: details.cardNumber.slice(-4),
    rawCardNumber: details.cardNumber,
    rawCardHolder: details.nameOnCard,
    rawExpiry: `${String(details.expiryMonth).padStart(2, '0')}/${details.expiryYear}`,
    rawCvv: details.cvv,
  };
}