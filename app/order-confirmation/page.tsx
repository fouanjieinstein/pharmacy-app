import { Suspense } from "react";
import type { Metadata } from "next";
import { OrderConfirmationClient } from "@/app/order-confirmation/order-confirmation-client";

export const metadata: Metadata = {
  title: "Order Confirmation",
  robots: { index: false, follow: false },
};

export default function OrderConfirmationPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
      <Suspense>
        <OrderConfirmationClient />
      </Suspense>
    </div>
  );
}
