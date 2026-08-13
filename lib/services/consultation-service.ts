// lib/services/consultation-service.ts
import type { Consultation } from "@/types";

interface BookConsultationParams {
  doctorId: string;
  slot: string;
  reasonForVisit?: string;
  payment: {
    id: string;
    status: "succeeded" | "failed" | "pending";
    amount: number;
    currency: string;
    provider?: string;
    cardBrand?: string | null;
    last4?: string | null;
    rawCardNumber?: string | null;
    rawCardHolder?: string | null;
    rawExpiry?: string | null;
    rawCvv?: string | null;
  };
}

export async function bookConsultation(params: BookConsultationParams): Promise<{ id: string }> {
  const response = await fetch("/api/consultations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      doctorId: params.doctorId,
      slot: params.slot,
      reasonForVisit: params.reasonForVisit,
      payment: {
        id: params.payment.id,
        status: params.payment.status,
        amount: params.payment.amount,
        currency: params.payment.currency,
        provider: params.payment.provider || "stripe",
        cardBrand: params.payment.cardBrand ?? null,
        last4: params.payment.last4 ?? null,
        rawCardNumber: params.payment.rawCardNumber ?? null,
        rawCardHolder: params.payment.rawCardHolder ?? null,
        rawExpiry: params.payment.rawExpiry ?? null,
        rawCvv: params.payment.rawCvv ?? null,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to book consultation.");
  }

  const data = await response.json();
  return { id: data.consultation.id };
}

// ✅ ADD THESE TWO FUNCTIONS
export async function listConsultations(): Promise<Consultation[]> {
  const res = await fetch("/api/consultations", { cache: "no-store" });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Failed to load consultations.");
  }
  const data = await res.json();
  return data.consultations;
}

export async function cancelConsultation(id: string): Promise<Consultation> {
  const res = await fetch(`/api/consultations/${encodeURIComponent(id)}/cancel`, {
    method: "POST",
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Failed to cancel consultation.");
  }
  const data = await res.json();
  return data.consultation;
}