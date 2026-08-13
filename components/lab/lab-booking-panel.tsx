"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarCheck, CheckCircle2, Home, Building2, Crown } from "lucide-react";
import type { LabTest, LabCollectionMode, PaymentTransaction } from "@/types";
import { HOME_COLLECTION_FEE_USD } from "@/lib/data/lab-tests";
import { useCurrency } from "@/lib/context/currency-context";
import { useAuth } from "@/lib/context/auth-context";
import { useMembership } from "@/lib/context/membership-context";
import { useToast } from "@/lib/context/toast-context";
import { createLabBooking, generateLabSlots } from "@/lib/services/lab-booking-service";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SignInPrompt } from "@/components/ui/sign-in-prompt";
import { StepPayment } from "@/components/checkout/step-payment";
import { cn } from "@/lib/utils/cn";

type Stage = "select" | "payment" | "confirmed";

export function LabBookingPanel({ test }: { test: LabTest }) {
  const { format, currency } = useCurrency();
  const { user } = useAuth();
  const { isPlusMember } = useMembership();
  const { showToast } = useToast();

  const [stage, setStage] = useState<Stage>("select");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const [slots, setSlots] = useState<string[]>([]);
  useEffect(() => {
    const generated = generateLabSlots(test.id);
    setSlots(generated);
    setSelectedSlot((current) => current ?? generated[0] ?? null);
  }, [test.id]);

  const [mode, setMode] = useState<LabCollectionMode>(
    test.homeCollectionAvailable ? "home-visit" : "collection-centre"
  );
  const [address, setAddress] = useState("");
  const [processing, setProcessing] = useState(false);
  const [declineReason, setDeclineReason] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  const collectionFee =
    mode === "home-visit" && !isPlusMember ? HOME_COLLECTION_FEE_USD : 0;
  const total = test.priceUsd + collectionFee;

  const handlePaymentComplete = async (transaction: PaymentTransaction) => {
    if (!selectedSlot || !user) return;
    setProcessing(true);
    setDeclineReason(null);

    try {
      const booking = await createLabBooking({
        testIds: [test.id],
        slot: selectedSlot,
        collectionMode: mode,
        collectionAddress: mode === "home-visit" ? address : undefined,
        subtotalUsd: test.priceUsd,
        collectionFeeUsd: collectionFee,
        currency,
        payment: {
          id: transaction.id,
            customerId: user.id,
  timestamp: new Date().toISOString(),
          status: transaction.status,
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
      setReference(booking.reference);
      setStage("confirmed");
      showToast("Lab test booked successfully.", "success");
    } catch (err) {
      setDeclineReason(err instanceof Error ? err.message : "Couldn't complete the booking. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const handlePaymentDeclined = (reason: string) => {
    setDeclineReason(reason);
  };

  if (!user) {
    return (
      <div className="sticky top-24 rounded-md border border-brand-gray-200 bg-white p-6">
        <div className="mb-4 flex items-baseline justify-between">
          <h3 className="font-display text-lg text-brand-navy-900">Book This Test</h3>
          <span className="font-display text-xl text-brand-navy-900">{format(test.priceUsd)}</span>
        </div>
        <SignInPrompt message="Sign in to book this lab test and choose a collection slot." />
      </div>
    );
  }

  if (stage === "confirmed") {
    return (
      <div className="rounded-md border border-brand-gray-200 bg-white p-6 text-center">
        <span className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-brand-emerald-50 text-brand-emerald-600">
          <CheckCircle2 className="size-6" />
        </span>
        <h3 className="font-display text-lg text-brand-navy-900">Booking Confirmed</h3>
        <p className="mt-1.5 text-sm text-brand-gray-500">
          Reference <span className="font-medium text-brand-navy-900">{reference}</span>
        </p>
        <p className="mt-1 text-sm text-brand-gray-500">
          {selectedSlot &&
            new Date(selectedSlot).toLocaleString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
        </p>
        <p className="mt-1 text-xs text-brand-gray-500">
          {mode === "home-visit" ? "Home sample collection" : "Collection centre visit"}
        </p>
        <Link href="/account/lab-bookings" className="mt-5 inline-block text-sm font-medium text-brand-emerald-700 underline">
          View My Lab Bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="sticky top-24 rounded-md border border-brand-gray-200 bg-white p-6">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="font-display text-lg text-brand-navy-900">Book This Test</h3>
        <span className="font-display text-xl text-brand-navy-900">{format(test.priceUsd)}</span>
      </div>

      {test.requiresReferral && (
        <div className="mb-4 rounded-sm bg-brand-gold-50 px-3.5 py-2.5 text-xs text-brand-gold-700">
          This test requires a referring clinician&apos;s order. You can book now — our team will confirm
          the referral with you before the sample is processed.
        </div>
      )}

      {stage === "select" && (
        <div className="space-y-5">
          <div>
            <p className="mb-2 text-sm font-medium text-brand-navy-900">Collection method</p>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => setMode("home-visit")}
                disabled={!test.homeCollectionAvailable}
                className={cn(
                  "flex items-start gap-2.5 rounded-sm border px-3.5 py-3 text-left text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                  mode === "home-visit"
                    ? "border-brand-emerald-500 bg-brand-emerald-50"
                    : "border-brand-gray-300 hover:border-brand-navy-900"
                )}
              >
                <Home className="mt-0.5 size-4 shrink-0 text-brand-emerald-600" />
                <span className="flex-1">
                  <span className="block font-medium text-brand-navy-900">Home sample collection</span>
                  <span className="block text-brand-gray-500">
                    {test.homeCollectionAvailable
                      ? isPlusMember
                        ? "Free with Meridian Plus"
                        : `+${format(HOME_COLLECTION_FEE_USD)} collection fee`
                      : "Not available for this sample type"}
                  </span>
                </span>
                {mode === "home-visit" && isPlusMember && test.homeCollectionAvailable && (
                  <Badge variant="gold" className="shrink-0">
                    <Crown className="size-3" /> Free
                  </Badge>
                )}
              </button>

              <button
                onClick={() => setMode("collection-centre")}
                className={cn(
                  "flex items-start gap-2.5 rounded-sm border px-3.5 py-3 text-left text-xs transition-colors",
                  mode === "collection-centre"
                    ? "border-brand-emerald-500 bg-brand-emerald-50"
                    : "border-brand-gray-300 hover:border-brand-navy-900"
                )}
              >
                <Building2 className="mt-0.5 size-4 shrink-0 text-brand-emerald-600" />
                <span>
                  <span className="block font-medium text-brand-navy-900">Visit a collection centre</span>
                  <span className="block text-brand-gray-500">No collection fee</span>
                </span>
              </button>
            </div>
          </div>

          {mode === "home-visit" && (
            <Textarea
              id="labCollectionAddress"
              label="Collection address"
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Where should our phlebotomist meet you?"
            />
          )}

          <div>
            <p className="mb-2 text-sm font-medium text-brand-navy-900">Select a slot</p>
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

          <div className="space-y-1.5 border-t border-brand-gray-100 pt-4 text-sm">
            <div className="flex justify-between text-brand-gray-600">
              <span>Test fee</span>
              <span className="text-brand-navy-900">{format(test.priceUsd)}</span>
            </div>
            <div className="flex justify-between text-brand-gray-600">
              <span>Collection</span>
              <span className="text-brand-navy-900">
                {collectionFee > 0 ? format(collectionFee) : "Free"}
              </span>
            </div>
            <div className="flex justify-between border-t border-brand-gray-100 pt-1.5 font-medium text-brand-navy-900">
              <span>Total</span>
              <span className="font-display text-lg">{format(total)}</span>
            </div>
          </div>

          <Button
            fullWidth
            size="lg"
            disabled={!selectedSlot || (mode === "home-visit" && !address.trim())}
            onClick={() => setStage("payment")}
          >
            <CalendarCheck className="size-4" /> Continue to Payment
          </Button>
        </div>
      )}

      {stage === "payment" && (
        <StepPayment
          amountUsd={total}
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