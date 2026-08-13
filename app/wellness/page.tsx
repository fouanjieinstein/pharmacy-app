import type { Metadata } from "next";
import { Leaf } from "lucide-react";
import { products } from "@/lib/data/products";
import { CategoryProductsClient } from "@/components/products/category-products-client";

export const metadata: Metadata = {
  title: "Wellness & Preventive Health",
  description: "Vitamins, minerals, nutritional supplements, and preventive healthcare products.",
};

export default function WellnessPage() {
  const wellnessProducts = products.filter((p) => p.group === "wellness");

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <div className="mb-10 max-w-2xl">
        <span className="mb-3 inline-flex size-11 items-center justify-center rounded-full bg-brand-gold-50 text-brand-gold-600">
          <Leaf className="size-5.5" />
        </span>
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold-600">Wellness & Preventive Health</p>
        <h1 className="font-display mt-1.5 text-3xl text-brand-navy-900">Everyday Wellness, Backed by Consistency</h1>
        <p className="mt-3 text-sm leading-relaxed text-brand-gray-500">
          Vitamins, minerals, nutritional supplements, and healthy-aging products to support your general
          wellbeing as part of a balanced lifestyle. These products are not intended to diagnose, treat,
          cure, or prevent any disease.
        </p>
      </div>

      <CategoryProductsClient products={wellnessProducts} />
    </div>
  );
}
