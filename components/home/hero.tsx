import Link from "next/link";
import { ShieldCheck, Lock, Stethoscope, Globe2, ArrowRight, Star } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  BlisterPackIllustration,
  CapsuleIllustration,
  SyrupBottleIllustration,
  InjectionPenIllustration,
} from "@/components/products/product-illustrations";

const trustItems = [
  { icon: ShieldCheck, label: "Licensed Pharmacy" },
  { icon: Lock, label: "Secure Payments" },
  { icon: Stethoscope, label: "Pharmacist Review" },
  { icon: Globe2, label: "International Delivery" },
];

const showcaseCards = [
  { Illustration: BlisterPackIllustration, tint: "bg-brand-emerald-50 text-brand-emerald-700", className: "translate-x-2 -translate-y-3 rotate-[-6deg]" },
  { Illustration: CapsuleIllustration, tint: "bg-white text-brand-navy-800", className: "translate-x-24 translate-y-6 rotate-[4deg]" },
  { Illustration: SyrupBottleIllustration, tint: "bg-brand-gold-50 text-brand-gold-700", className: "translate-x-4 translate-y-32 rotate-[-3deg]" },
  { Illustration: InjectionPenIllustration, tint: "bg-white text-brand-navy-800", className: "translate-x-32 translate-y-44 rotate-[5deg]" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-navy-900">
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(white 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      <div className="absolute -right-32 -top-32 size-96 rounded-full bg-brand-emerald-600/20 blur-3xl" />
      <div className="absolute -left-32 bottom-0 size-96 rounded-full bg-brand-gold-500/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 py-20 sm:py-28 lg:grid-cols-[1fr_380px] lg:px-8">
        <div className="max-w-2xl">
          <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-brand-emerald-300">
            Headquartered in India · Serving customers worldwide
          </span>
          <h1 className="font-display mt-6 text-4xl leading-[1.1] text-white sm:text-5xl lg:text-6xl">
            Trusted Healthcare,
            <br />
            Delivered Worldwide.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-brand-gray-300 sm:text-lg">
            Meridian Health is a licensed international pharmacy offering over-the-counter, prescription,
            and wellness products — dispensed with pharmacist oversight and shipped through secure
            checkout to eligible destinations worldwide.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/shop" className={buttonVariants({ variant: "secondary", size: "lg" })}>
              Shop Medicines <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/prescription"
              className={buttonVariants({
                size: "lg",
                className: "bg-white/10 text-white hover:bg-white/20 backdrop-blur",
              })}
            >
              Upload Prescription
            </Link>
          </div>

          <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
            {trustItems.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5">
                <Icon className="size-5 shrink-0 text-brand-emerald-400" />
                <dt className="text-sm font-medium text-white">{label}</dt>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative hidden lg:block" aria-hidden>
          <div className="relative h-[420px] w-[280px]">
            {showcaseCards.map(({ Illustration, tint, className }, i) => (
              <div
                key={i}
                className={`absolute flex size-24 items-center justify-center rounded-2xl shadow-xl ${tint} ${className}`}
              >
                <Illustration className="size-14" />
              </div>
            ))}
            <div className="absolute translate-x-8 translate-y-16 flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-xs font-semibold text-brand-navy-900 shadow-xl">
              <Star className="size-3.5 fill-brand-gold-500 text-brand-gold-500" />
              4.7 average rating
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
