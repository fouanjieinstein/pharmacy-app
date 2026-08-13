import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { ailments } from "@/lib/data/categories";

export const metadata: Metadata = {
  title: "Shop by Ailment",
  description: "Find products organized by common health conditions and symptoms.",
};

export default function AilmentsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <div className="mb-10 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-emerald-600">Shop by Ailment</p>
        <h1 className="font-display mt-1.5 text-3xl text-brand-navy-900">Find Relief for Common Conditions</h1>
        <p className="mt-3 text-sm leading-relaxed text-brand-gray-500">
          Browse products organized by symptom or condition. This is general educational guidance, not a
          diagnosis — always consult a healthcare professional for medical advice specific to you.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ailments.map((ailment) => (
          <Link
            key={ailment.id}
            href={`/shop?category=${ailment.relatedCategories.join(",")}`}
            className="group flex flex-col justify-between rounded-md border border-brand-gray-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-brand-emerald-300 hover:shadow-md"
          >
            <div>
              <h2 className="text-base font-semibold text-brand-navy-900">{ailment.label}</h2>
              <p className="mt-2 text-sm leading-relaxed text-brand-gray-500">{ailment.description}</p>
            </div>
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-brand-emerald-700">
              View products <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
