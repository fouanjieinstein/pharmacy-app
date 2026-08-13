import type { Metadata } from "next";
import { ShieldCheck, Stethoscope, Globe2, Lock, MapPin } from "lucide-react";
import { company } from "@/lib/data/company";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Meridian Health, a licensed international pharmacy headquartered in India.",
};

const values = [
  { icon: ShieldCheck, title: "Licensed & Regulated", description: "Operating as a licensed pharmacy, with dispensing practices aligned to applicable pharmaceutical regulations." },
  { icon: Stethoscope, title: "Pharmacist-Led", description: "A team of licensed pharmacists reviews every prescription order before it is processed." },
  { icon: Globe2, title: "International Reach", description: "Serving eligible customers across multiple countries through established logistics partners, within the bounds of destination-country regulation." },
  { icon: Lock, title: "Security by Design", description: "Built around tokenized payments, access-controlled prescription handling, and modern web security practices." },
];

export default function AboutPage() {
  return (
    <div>
      <div className="relative overflow-hidden bg-brand-navy-900 py-16">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "radial-gradient(white 1px, transparent 1px)", backgroundSize: "22px 22px" }}
        />
        <div className="absolute -right-24 -top-24 size-72 rounded-full bg-brand-emerald-600/20 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-emerald-400">About Us</p>
          <h1 className="font-display mt-1.5 text-4xl text-white">Trusted Healthcare, Delivered Worldwide</h1>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-14 lg:px-8">
        <p className="text-base leading-relaxed text-brand-gray-600">
          Meridian Health is an international online pharmacy headquartered in India, offering over-the-counter,
          prescription, and wellness products to customers in eligible countries. We combine pharmacist oversight,
          destination-aware compliance checks, and secure checkout to make ordering medication online more
          transparent and trustworthy.
        </p>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {values.map((v) => (
            <div key={v.title} className="flex gap-4 rounded-md border border-brand-gray-200 p-5">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-emerald-50 text-brand-emerald-600">
                <v.icon className="size-5" />
              </span>
              <div>
                <h2 className="text-sm font-semibold text-brand-navy-900">{v.title}</h2>
                <p className="mt-1 text-sm text-brand-gray-500">{v.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex items-start gap-3 rounded-md border border-brand-gray-200 bg-brand-gray-50 p-5">
          <MapPin className="mt-0.5 size-5 shrink-0 text-brand-emerald-600" />
          <div>
            <p className="text-sm font-semibold text-brand-navy-900">{company.legalName}</p>
            <p className="mt-1 text-sm text-brand-gray-600">{company.addressLines.join(", ")}</p>
            <p className="mt-1 text-sm text-brand-gray-600">{company.supportEmail} · {company.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
