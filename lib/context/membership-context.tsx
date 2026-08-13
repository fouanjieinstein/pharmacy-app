"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { MembershipStatus, PaymentTransaction } from "@/types";
import { useAuth } from "@/lib/context/auth-context";

// Membership status is now server-backed (Membership table, POST/GET/cancel
// under /api/membership) — see lib/server/membership-schemas.ts. Orders
// verify Plus pricing against this same table server-side rather than
// trusting the client.

interface SubscribeResult {
  ok: boolean;
  error?: string;
}

interface MembershipContextValue {
  status: MembershipStatus;
  isPlusMember: boolean;
  loading: boolean;
  subscribe: (planId: string, payment: PaymentTransaction) => Promise<SubscribeResult>;
  cancelMembership: () => Promise<SubscribeResult>;
}

const MembershipContext = createContext<MembershipContextValue | null>(null);
const DEFAULT_STATUS: MembershipStatus = { active: false, planId: null, subscribedAt: null, renewsAt: null };

export function MembershipProvider({ children }: { children: ReactNode }) {
  const { isSignedIn } = useAuth();
  const [status, setStatus] = useState<MembershipStatus>(DEFAULT_STATUS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSignedIn) {
      setStatus(DEFAULT_STATUS);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch("/api/membership", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setStatus(data.status ?? DEFAULT_STATUS))
      .catch(() => setStatus(DEFAULT_STATUS))
      .finally(() => setLoading(false));
  }, [isSignedIn]);

  const subscribe = async (planId: string, payment: PaymentTransaction): Promise<SubscribeResult> => {
    const res = await fetch("/api/membership", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        planId,
        payment: {
          provider: payment.provider,
          status: payment.status,
          amount: payment.amount,
          cardBrand: payment.cardBrand,
          last4: payment.last4,
        },
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: data.error ?? "Couldn't activate membership." };
    setStatus(data.status);
    return { ok: true };
  };

  const cancelMembership = async (): Promise<SubscribeResult> => {
    const res = await fetch("/api/membership/cancel", { method: "POST" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: data.error ?? "Couldn't cancel membership." };
    setStatus(data.status);
    return { ok: true };
  };

  return (
    <MembershipContext.Provider value={{ status, isPlusMember: status.active, loading, subscribe, cancelMembership }}>
      {children}
    </MembershipContext.Provider>
  );
}

export function useMembership() {
  const ctx = useContext(MembershipContext);
  if (!ctx) throw new Error("useMembership must be used within MembershipProvider");
  return ctx;
}
