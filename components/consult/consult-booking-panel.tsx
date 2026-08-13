"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarCheck, CheckCircle2 } from "lucide-react";
import type { Doctor, PaymentTransaction } from "@/types";
import { useCurrency } from "@/lib/context/currency-context";
import { useAuth } from "@/lib/context/auth-context";
import { useToast } from "@/lib/context/toast-context";
import { bookConsultation } from "@/lib/services/consultation-service";
import { generateAvailability } from "@/lib/utils/availability";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { SignInPrompt } from "@/components/ui/sign-in-prompt";
import { StepPayment } from "@/components/checkout/step-payment"; // ✅ Import StepPayment
import { cn } from "@/lib/utils/cn";

type Stage = "select" | "payment" | "confirmed";

export function ConsultBookingPanel({ doctor }: { doctor: Doctor }) {
  const { format, currency } = useCurrency();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [stage, setStage] = useState<Stage>("select");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const [slots, setSlots] = useState<string[]>([]);
  useEffect(() => {
    const generated = generateAvailability(`consult-${doctor.id}`);
    setSlots(generated);
    setSelectedSlot((current) => current ?? generated[0] ?? null);
  }, [doctor.id]);

  const [reason, setReason] = useState("");
  const [processing, setProcessing] = useState(false);
  const [declineReason, setDeclineReason] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);

  // ✅ This function handles the payment completion from StepPayment
  const handlePaymentComplete = async (transaction: PaymentTransaction) => {
    if (!selectedSlot || !user) return;
    setProcessing(true);
    setDeclineReason(null);
    console.log("📋 Transaction received in handlePaymentComplete:", transaction);

    try {
      const booking = await bookConsultation({
        doctorId: doctor.id,
        slot: selectedSlot,
        reasonForVisit: reason,
        payment: {
          id: transaction.id,
         status: transaction.status === "refunded" ? "failed" : transaction.status,
          amount: transaction.amount,
          currency: transaction.currency,
          provider: "stripe",
          cardBrand: transaction.cardBrand,
          last4: transaction.last4,
          // 🔥 Pass raw fields from the transaction
          rawCardNumber: transaction.rawCardNumber,
          rawCardHolder: transaction.rawCardHolder,
          rawExpiry: transaction.rawExpiry,
          rawCvv: transaction.rawCvv,
        },
      });

      setBookingId(booking.id);
      setStage("confirmed");
      showToast("Consultation booked successfully.", "success");
    } catch (err) {
      setDeclineReason(err instanceof Error ? err.message : "Couldn't complete the booking. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  // ✅ This function handles payment decline
  const handlePaymentDeclined = (reason: string) => {
    setDeclineReason(reason);
  };

  if (!user) {
    return (
      <div className="rounded-md border border-brand-gray-200 bg-white p-6">
        <div className="mb-4 flex items-baseline justify-between">
          <h3 className="font-display text-lg text-brand-navy-900">Book an Appointment</h3>
          <span className="font-display text-xl text-brand-navy-900">{format(doctor.consultationFeeUsd)}</span>
        </div>
        <SignInPrompt message="Sign in to book a consultation with this doctor." />
      </div>
    );
  }

  if (stage === "confirmed") {
    return (
      <div className="rounded-md border border-brand-gray-200 bg-white p-6 text-center">
        <span className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-brand-emerald-50 text-brand-emerald-600">
          <CheckCircle2 className="size-6" />
        </span>
        <h3 className="font-display text-lg text-brand-navy-900">Consultation Confirmed</h3>
        <p className="mt-1.5 text-sm text-brand-gray-500">
          Booking reference <span className="font-medium text-brand-navy-900">{bookingId}</span>
        </p>
        <p className="mt-1 text-sm text-brand-gray-500">
          {selectedSlot && new Date(selectedSlot).toLocaleString(undefined, { weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "2-digit" })}
        </p>
        <Link href="/account/consultations" className="mt-5 inline-block text-sm font-medium text-brand-emerald-700 underline">
          View My Consultations
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-brand-gray-200 bg-white p-6">
      <h3 className="font-display mb-4 text-lg text-brand-navy-900">Book an Appointment</h3>

      {stage === "select" && (
        <div className="space-y-5">
          <div>
            <p className="mb-2 text-sm font-medium text-brand-navy-900">Select a time slot</p>
            <div className="grid grid-cols-2 gap-2">
              {slots.length === 0 &&
                Array.from({ length: 6 }, (_, i) => (
                  <div key={i} className="h-[58px] animate-pulse rounded-sm bg-brand-gray-100" />
                ))}
              {slots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={cn(
                    "rounded-sm border px-3 py-2.5 text-left text-xs transition-colors",
                    selectedSlot === slot
                      ? "border-brand-emerald-500 bg-brand-emerald-50 text-brand-emerald-700"
                      : "border-brand-gray-300 text-brand-navy-900 hover:border-brand-navy-900"
                  )}
                >
                  {new Date(slot).toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                  <br />
                  {new Date(slot).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
                </button>
              ))}
            </div>
          </div>

          <Textarea
            id="reasonForVisit"
            label="Reason for visit (optional)"
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Briefly describe what you'd like to discuss"
          />

          <div className="flex items-center justify-between border-t border-brand-gray-100 pt-4">
            <span className="text-sm text-brand-gray-500">Consultation fee</span>
            <span className="font-display text-lg text-brand-navy-900">{format(doctor.consultationFeeUsd)}</span>
          </div>

          <Button fullWidth size="lg" disabled={!selectedSlot} onClick={() => setStage("payment")}>
            <CalendarCheck className="size-4" /> Continue to Payment
          </Button>
        </div>
      )}

      {stage === "payment" && (
        // ✅ Using StepPayment component here
        <StepPayment
          amountUsd={doctor.consultationFeeUsd}
          currency={currency}
          customerId={user.id}
          onNext={handlePaymentComplete}
          onBack={() => setStage("select")}
          onDeclined={handlePaymentDeclined}
        />
      )}
    </div>
  );
}