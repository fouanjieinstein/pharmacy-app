import Link from "next/link";
import type { Metadata } from "next";
import { ShieldAlert, Stethoscope, FileCheck2 } from "lucide-react";
import { getProductsByCategory } from "@/lib/data/products";
import { CategoryProductsClient } from "@/components/products/category-products-client";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Oncology",
  description: "Physician-directed oncology and oncology-support medications, dispensed against a verified prescription.",
};

export default function OncologyPage() {
  const oncologyProducts = getProductsByCategory("oncology");

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <div className="mb-10 max-w-3xl">
        <span className="mb-3 inline-flex size-11 items-center justify-center rounded-full bg-brand-navy-900 text-white">
          <Stethoscope className="size-5.5" />
        </span>
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-navy-900">Oncology</p>
        <h1 className="font-display mt-1.5 text-3xl text-brand-navy-900">Oncology & Oncology-Support Medications</h1>
        <p className="mt-3 text-sm leading-relaxed text-brand-gray-500">
          Every medication in this category is dispensed strictly against a valid prescription from a
          treating oncology specialist, and is reviewed by a licensed pharmacist before dispatch. These
          medications are components of a broader, physician-directed treatment plan — no medication on
          this platform is marketed as a cure for cancer or any other disease.
        </p>
      </div>

      <div className="mb-10 grid grid-cols-1 gap-4 rounded-md border border-brand-gold-100 bg-brand-gold-50 p-6 sm:grid-cols-3">
        <div className="flex gap-3">
          <FileCheck2 className="size-5 shrink-0 text-brand-gold-700" />
          <div>
            <p className="text-sm font-semibold text-brand-navy-900">Valid Prescription Required</p>
            <p className="mt-1 text-xs text-brand-gray-600">A specialist-issued prescription is mandatory for every order.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Stethoscope className="size-5 shrink-0 text-brand-gold-700" />
          <div>
            <p className="text-sm font-semibold text-brand-navy-900">Pharmacist-Reviewed</p>
            <p className="mt-1 text-xs text-brand-gray-600">Every order is manually reviewed before it is processed.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <ShieldAlert className="size-5 shrink-0 text-brand-gold-700" />
          <div>
            <p className="text-sm font-semibold text-brand-navy-900">Country Restrictions Apply</p>
            <p className="mt-1 text-xs text-brand-gray-600">Availability is limited to select destination countries.</p>
          </div>
        </div>
      </div>

      <CategoryProductsClient products={oncologyProducts} />

      <div className="mt-10 flex flex-col items-start gap-4 rounded-md border border-brand-gray-200 bg-brand-gray-50 p-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-brand-gray-600">Have a prescription from your oncologist ready?</p>
        <Link href="/prescription" className={buttonVariants({ variant: "secondary" })}>
          Upload Prescription
        </Link>
      </div>
    </div>
  );
}
