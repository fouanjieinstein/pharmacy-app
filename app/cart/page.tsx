import type { Metadata } from "next";
import { CartClient } from "@/app/cart/cart-client";

export const metadata: Metadata = {
  title: "Your Cart",
  description: "Review items in your cart before checkout.",
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <h1 className="font-display mb-8 text-3xl text-brand-navy-900">Your Cart</h1>
      <CartClient />
    </div>
  );
}
