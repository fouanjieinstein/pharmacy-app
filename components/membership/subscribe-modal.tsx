"use client";

import { useState } from "react";
import { Crown, Lock, XCircle } from "lucide-react";
import type { MembershipPlan, PaymentTransaction } from "@/types";
import { useCurrency } from "@/lib/context/currency-context";
import { useAuth } from "@/lib/context/auth-context";
import { useMembership } from "@/lib/context/membership-context";
import { useToast } from "@/lib/context/toast-context";
import { subscribe } from "@/lib/services/membership-service";
import { Modal } from "@/components/ui/modal";
import { SignInPrompt } from "@/components/ui/sign-in-prompt";
import { Button } from "@/components/ui/button";
import { StepPayment } from "@/components/checkout/step-payment";

type Stage = "confirm" | "payment";

export function SubscribeModal({
  plan,
  open,
  onClose,
}: {
  plan: MembershipPlan | null;
  open: boolean;
  onClose: () => void;
}) {
  const { format } = useCurrency();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [stage, setStage] = useState<Stage>("confirm");
  const [processing, setProcessing] = useState(false);
  const [declineReason, setDeclineReason] = useState<string | null>(null);

  if (!plan) return null;

  if (!user) {
    return (
      <Modal open={open} onClose={onClose} title={`Subscribe to ${plan.name}`}>
        <SignInPrompt message="Sign in to start your Meridian Plus membership." />
      </Modal>
    );
  }

  const handlePaymentComplete = async (transaction: PaymentTransaction) => {
    setProcessing(true);
    setDeclineReason(null);

    const result = await subscribe(plan.id, transaction);
    setProcessing(false);

    if (!result.ok) {
      setDeclineReason(result.error ?? "Couldn't activate your membership. Please try again.");
      return;
    }

    showToast(`Welcome to ${plan.name}!`, "success");
    onClose();
    // Reset state when modal closes
    setStage("confirm");
  };

  const handlePaymentDeclined = (reason: string) => {
    setDeclineReason(reason);
  };

  const handleBack = () => {
    setStage("confirm");
    setDeclineReason(null);
  };

  return (
    <Modal open={open} onClose={onClose} title={`Subscribe to ${plan.name}`}>
      {stage === "confirm" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-sm bg-brand-gold-50 px-3.5 py-2.5 text-sm text-brand-gold-700">
            <span className="flex items-center gap-2">
              <Crown className="size-4" />
              Billed {plan.billingPeriod}
            </span>
            <span className="font-display text-lg">{format(plan.priceUsd)}</span>
          </div>

          <div className="space-y-2 text-sm text-brand-gray-600">
            <p>You'll get:</p>
            <ul className="list-disc space-y-1 pl-5">
              {plan.benefits.map((benefit, i) => (
                <li key={i}>{benefit}</li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-2 rounded-sm bg-brand-gray-50 px-3.5 py-2.5 text-xs text-brand-gray-500">
            <Lock className="size-4 shrink-0 text-brand-emerald-600" />
            Securely tokenized — never stored raw. Cancel anytime from your account.
          </div>

          <Button fullWidth size="lg" onClick={() => setStage("payment")}>
            Continue to Payment
          </Button>
        </div>
      )}

      {stage === "payment" && (
        <div className="space-y-4">
          {declineReason && (
            <div role="alert" className="flex items-center gap-2 rounded-sm bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
              <XCircle className="size-4 shrink-0" /> {declineReason}
            </div>
          )}

          <StepPayment
            amountUsd={plan.priceUsd}
            currency="USD"
            customerId={user.id}
            onNext={handlePaymentComplete}
            onBack={handleBack}
            onDeclined={handlePaymentDeclined}
          />
        </div>
      )}
    </Modal>
  );
}