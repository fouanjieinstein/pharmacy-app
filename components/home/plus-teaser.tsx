import Link from "next/link";
import { Crown, Sparkles, Truck, Stethoscope, ShieldCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

const perks = [
  { icon: Sparkles, label: "5% member pricing on every order" },
  { icon: Truck, label: "Free Standard International shipping" },
  { icon: Stethoscope, label: "10% off doctor consultations" },
  { icon: ShieldCheck, label: "Priority pharmacist prescription review" },
];

export function PlusTeaser() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div className="overflow-hidden rounded-md bg-gradient-to-br from-brand-navy-900 via-brand-navy-900 to-brand-gold-900/40 p-8 sm:p-12">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-gold-600 to-brand-gold-500 px-3 py-1 text-xs font-semibold text-white">
              <Crown className="size-3.5" /> Meridian Plus
            </span>
            <h2 className="font-display text-2xl text-white sm:text-3xl">Save More on Every Order</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-brand-gray-300">
              Join Meridian Plus for member pricing, free standard shipping, discounted consultations, and
              priority prescription review — starting at a few dollars a month.
            </p>
            <Link href="/plus" className={buttonVariants({ variant: "gold", size: "lg", className: "mt-6" })}>
              Explore Plans
            </Link>
          </div>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {perks.map((perk) => (
              <li key={perk.label} className="flex items-start gap-2.5 rounded-md border border-white/10 bg-white/5 p-4">
                <perk.icon className="size-4.5 shrink-0 text-brand-gold-400" />
                <span className="text-xs text-white">{perk.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
