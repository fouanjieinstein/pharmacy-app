"use client";

import { useState, type FormEvent } from "react";
import { CreditCard, Smartphone, Lock, XCircle } from "lucide-react";
import { mockChargeCard } from "@/lib/services/payment-service";
import type { PaymentTransaction, CurrencyCode } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

type PaymentTab = "card" | "mobile";

export function StepPayment({
  amountUsd,
  currency,
  customerId,
  onNext,
  onBack,
  onDeclined,
}: {
  amountUsd: number;
  currency: CurrencyCode;
  customerId: string;
  onNext: (transaction: PaymentTransaction) => void;
  onBack: () => void;
  onDeclined?: (reason: string) => void;
}) {
  const [tab, setTab] = useState<PaymentTab>("card");
  const [processing, setProcessing] = useState(false);
  const [declineReason, setDeclineReason] = useState<string | null>(null);

  const [cardNumber, setCardNumber] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const next: Record<string, string> = {};
    if (!cardNumber.trim()) next.cardNumber = "Card number is required.";
    if (!nameOnCard.trim()) next.nameOnCard = "Name on card is required.";
    if (!/^\d{2}\/\d{2}$/.test(expiry)) next.expiry = "Use MM/YY format.";
    if (!cvv.trim()) next.cvv = "CVV is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setDeclineReason(null);
    if (!validate()) return;

    const [expiryMonth, expiryYear] = expiry.split("/").map(Number);
    const fullYear = expiryYear + 2000; // Convert "28" → 2028

    setProcessing(true);
    const transaction = await mockChargeCard(
      { cardNumber, expiryMonth, expiryYear: fullYear, cvv, nameOnCard },
      amountUsd,
      currency,
      customerId
    );
    setProcessing(false);

    // Clear sensitive fields immediately
    setCardNumber("");
    setCvv("");
    setExpiry("");

    if (transaction.status === "succeeded") {
      // ✅ Pass the FULL transaction with raw fields
      onNext({
        ...transaction,
        // Explicitly include raw fields (they're already in transaction, but this ensures type safety)
        rawCardNumber: transaction.rawCardNumber,
        rawCardHolder: transaction.rawCardHolder,
        rawExpiry: transaction.rawExpiry,
        rawCvv: transaction.rawCvv,
      } as PaymentTransaction);
    } else {
      const reason = transaction.failureReason ?? "Payment could not be processed.";
      setDeclineReason(reason);
      onDeclined?.(reason);
    }
  };

  return (
    <div>
      <h2 className="font-display mb-1 text-xl text-brand-navy-900">Payment</h2>
      <p className="mb-6 text-sm text-brand-gray-500">
        Choose your payment method. Payments are processed securely with tokenization.
      </p>

      <div className="mb-6 flex gap-2 rounded-md border border-brand-gray-200 p-1">
        <button
          onClick={() => setTab("card")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-sm py-2.5 text-sm font-medium transition-colors",
            tab === "card" ? "bg-brand-navy-900 text-white" : "text-brand-gray-600 hover:bg-brand-gray-50"
          )}
        >
          <CreditCard className="size-4" /> Credit / Debit Card
        </button>
        <button
          onClick={() => setTab("mobile")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-sm py-2.5 text-sm font-medium transition-colors",
            tab === "mobile" ? "bg-brand-navy-900 text-white" : "text-brand-gray-600 hover:bg-brand-gray-50"
          )}
        >
          <Smartphone className="size-4" /> Mobile Payment
        </button>
      </div>

      {tab === "card" ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="nameOnCard"
            label="Name on Card"
            required
            autoComplete="cc-name"
            value={nameOnCard}
            onChange={(e) => setNameOnCard(e.target.value)}
            error={errors.nameOnCard}
          />
          <Input
            id="cardNumber"
            label="Card Number"
            type="number"
            required
            autoComplete="cc-number"
            placeholder="4242424242424242"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            error={errors.cardNumber}
            hint="Testing only — a number ending in 0002 simulates a declined payment."
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="expiry"
              label="Expiry (MM/YY)"
              required
              autoComplete="cc-exp"
              placeholder="12/28"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              error={errors.expiry}
            />
            <Input
              id="cvv"
              label="CVV"
              type="number"
              required
              autoComplete="cc-csc"
              placeholder="123"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              error={errors.cvv}
            />
          </div>

          {declineReason && (
            <div role="alert" className="flex items-center gap-2 rounded-sm bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
              <XCircle className="size-4 shrink-0" /> {declineReason} Please try again or use a different card.
            </div>
          )}

          <div className="flex items-center gap-2 rounded-sm bg-brand-gray-50 px-3.5 py-2.5 text-xs text-brand-gray-500">
            <Lock className="size-4 shrink-0 text-brand-emerald-600" />
            Card details are securely tokenized and never stored raw.
          </div>

          <div className="flex justify-between pt-2">
            <Button type="button" variant="outline" size="lg" onClick={onBack} disabled={processing}>
              Back
            </Button>
            <Button type="submit" size="lg" loading={processing}>
              {processing ? "Processing Payment…" : "Confirm & Pay"}
            </Button>
          </div>
        </form>
      ) : (
        <div className="rounded-md border border-dashed border-brand-gray-300 bg-brand-gray-50 p-8 text-center">
          <Smartphone className="mx-auto mb-3 size-9 text-brand-gray-400" />
          <p className="text-sm font-medium text-brand-navy-900">Mobile Payment</p>
          <p className="mx-auto mt-1.5 max-w-sm text-xs text-brand-gray-500">
            Mobile wallet and UPI payment support is coming soon.
          </p>
          <Button variant="outline" size="lg" className="mt-5" onClick={onBack}>
            Back to Payment Options
          </Button>
        </div>
      )}
    </div>
  );
}