import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/server/session";
import { CheckoutClient } from "@/app/checkout/checkout-client";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your order with secure checkout.",
};

export default async function CheckoutPage() {
  // Server-side gate, same pattern as /account — placing an order requires a
  // real account now that checkout no longer does ad hoc name+email signup.
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/checkout");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
      <h1 className="font-display mb-6 text-3xl text-brand-navy-900">Checkout</h1>
      <CheckoutClient />
    </div>
  );
}
