import { Suspense } from "react";
import type { Metadata } from "next";
import { ShopClient } from "@/app/shop/shop-client";

export const metadata: Metadata = {
  title: "Shop All Products",
  description: "Browse over-the-counter, prescription, and wellness products from Meridian Health.",
};

export default function ShopPage() {
  return (
    <Suspense>
      <ShopClient />
    </Suspense>
  );
}
