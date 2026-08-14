import { Truck, Crown, ShieldCheck, Sparkles, BadgePercent, Globe2 } from "lucide-react";

const PROMOS = [
  { icon: Truck, text: "International Delivery Available — eligibility varies by destination country" },
  { icon: Crown, text: "Save up to 20% on every order with Meridian Plus membership" },
  { icon: Sparkles, text: "New: Sexual Wellness, Baby & Mother Care, and Medical Devices now in stock" },
  { icon: ShieldCheck, text: "Every prescription is reviewed by a licensed pharmacist before it ships" },
  { icon: BadgePercent, text: "Free standard shipping on orders over $50" },
  { icon: Globe2, text: "Now shipping to 12 countries across 4 continents" },
];

function PromoItems() {
  return (
    <>
      {PROMOS.map(({ icon: Icon, text }, i) => (
        <span key={i} className="inline-flex items-center gap-1.5 px-6">
          <Icon className="size-3.5 shrink-0 text-brand-emerald-400" />
          {text}
        </span>
      ))}
    </>
  );
}

export function PromoTicker() {
  return (
    <div className="overflow-hidden bg-brand-navy-900 py-2 text-xs font-medium whitespace-nowrap text-white">
      <div className="marquee-track inline-flex w-max">
        <PromoItems />
        <PromoItems />
      </div>
    </div>
  );
}
