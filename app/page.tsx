import Link from "next/link";
import { ArrowRight, Globe2, ShieldCheck, Stethoscope } from "lucide-react";
import { Hero } from "@/components/home/hero";
import { CategoryGrid } from "@/components/home/category-grid";
import { HowItWorks } from "@/components/home/how-it-works";
import { ConsultTeaser } from "@/components/home/consult-teaser";
import { LabTestsTeaser } from "@/components/home/lab-tests-teaser";
import { PlusTeaser } from "@/components/home/plus-teaser";
import { ProductGrid } from "@/components/products/product-grid";
import { buttonVariants } from "@/components/ui/button";
import { getFeaturedProducts } from "@/lib/data/products";

export default function HomePage() {
  const featured = getFeaturedProducts(8);

  return (
    <div>
      <Hero />

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-emerald-600">Shop by Category</p>
            <h2 className="font-display mt-1.5 text-2xl text-brand-navy-900 sm:text-3xl">Everyday Health, Organized Simply</h2>
          </div>
          <Link href="/shop" className="hidden items-center gap-1 text-sm font-medium text-brand-emerald-700 hover:underline sm:inline-flex">
            View all <ArrowRight className="size-4" />
          </Link>
        </div>
        <CategoryGrid />
      </section>

      <section className="bg-brand-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-emerald-600">Featured</p>
              <h2 className="font-display mt-1.5 text-2xl text-brand-navy-900 sm:text-3xl">Popular Products</h2>
            </div>
            <Link href="/shop" className="hidden items-center gap-1 text-sm font-medium text-brand-emerald-700 hover:underline sm:inline-flex">
              Browse all products <ArrowRight className="size-4" />
            </Link>
          </div>
          <ProductGrid products={featured} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="mb-12 max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-emerald-600">How It Works</p>
          <h2 className="font-display mt-1.5 text-2xl text-brand-navy-900 sm:text-3xl">From Cart to Doorstep, Responsibly</h2>
        </div>
        <HowItWorks />
      </section>

      <ConsultTeaser />

      <LabTestsTeaser />

      <section className="relative overflow-hidden bg-brand-navy-900 py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-emerald-400">Prescription Medicines</p>
            <h2 className="font-display mt-2 text-3xl text-white">Reviewed by Licensed Pharmacists — Every Time</h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-brand-gray-300">
              Cardiovascular, diabetes, respiratory, neurology, dermatology, gastroenterology, autoimmune,
              and oncology-support medications are dispensed only against a verified prescription, reviewed
              by our pharmacist team before dispatch.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/prescription" className={buttonVariants({ variant: "secondary", size: "lg" })}>
                Upload Prescription
              </Link>
              <Link
                href="/shop?group=prescription"
                className={buttonVariants({ size: "lg", className: "bg-white/10 text-white hover:bg-white/20" })}
              >
                Browse Prescription Medicines
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <div className="flex items-start gap-3 rounded-md border border-white/10 bg-white/5 p-5">
              <Stethoscope className="size-5 shrink-0 text-brand-emerald-400" />
              <div>
                <p className="text-sm font-semibold text-white">Pharmacist Review</p>
                <p className="mt-1 text-xs text-brand-gray-400">Every prescription order is checked before it ships.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-md border border-white/10 bg-white/5 p-5">
              <Globe2 className="size-5 shrink-0 text-brand-emerald-400" />
              <div>
                <p className="text-sm font-semibold text-white">Destination-Aware Eligibility</p>
                <p className="mt-1 text-xs text-brand-gray-400">We check import and prescription rules per country before you check out.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-md border border-white/10 bg-white/5 p-5">
              <ShieldCheck className="size-5 shrink-0 text-brand-emerald-400" />
              <div>
                <p className="text-sm font-semibold text-white">Secure by Design</p>
                <p className="mt-1 text-xs text-brand-gray-400">Payment tokenization — we never store your raw card details.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PlusTeaser />
    </div>
  );
}
