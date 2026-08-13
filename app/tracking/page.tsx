import { Suspense } from "react";
import type { Metadata } from "next";
import { TrackingClient } from "@/app/tracking/tracking-client";

export const metadata: Metadata = {
  title: "Track Your Order",
  description: "Track the delivery status of your Meridian Health order.",
};

export default function TrackingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <div className="mb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-emerald-600">Order Tracking</p>
        <h1 className="font-display mt-1.5 text-3xl text-brand-navy-900">Track Your Delivery</h1>
      </div>
      <Suspense>
        <TrackingClient />
      </Suspense>
    </div>
  );
}
