import type { Metadata } from "next";
import { Crown } from "lucide-react";
import { PlusClient } from "@/app/plus/plus-client";

export const metadata: Metadata = {
  title: "Meridian Plus Membership",
  description: "Save on every order with member pricing, free shipping, and priority prescription review.",
};

export default function PlusPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
      <div className="mb-10 max-w-2xl">
        <span className="mb-3 inline-flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-gold-600 to-brand-gold-500 text-white">
          <Crown className="size-5.5" />
        </span>
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold-600">Meridian Plus</p>
        <h1 className="font-display mt-1.5 text-3xl text-brand-navy-900">Save More on Every Order</h1>
        <p className="mt-3 text-sm leading-relaxed text-brand-gray-500">
          Meridian Plus is our membership plan for regular customers — member pricing, free standard
          shipping, discounted consultations, and priority pharmacist review.
        </p>
      </div>

      <PlusClient />
    </div>
  );
}
