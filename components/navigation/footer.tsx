import Link from "next/link";
import { Cross, ShieldCheck, Lock, Stethoscope, Globe2, MapPin, Mail, Phone } from "lucide-react";
import { company } from "@/lib/data/company";

const shopLinks = [
  { href: "/shop", label: "Shop All" },
  { href: "/ailments", label: "Shop by Ailment" },
  { href: "/prescription", label: "Prescription Medicines" },
  { href: "/consult", label: "Doctor Consult" },
  { href: "/lab-tests", label: "Lab Tests" },
  { href: "/wellness", label: "Wellness & Supplements" },
  { href: "/oncology", label: "Oncology" },
  { href: "/plus", label: "Meridian Plus" },
];

const supportLinks = [
  { href: "/faq", label: "FAQ" },
  { href: "/shipping", label: "Shipping Information" },
  { href: "/returns", label: "Returns & Refunds" },
  { href: "/contact", label: "Contact Us" },
  { href: "/tracking", label: "Track an Order" },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/medical-disclaimer", label: "Medical Disclaimer" },
  { href: "/about", label: "About Us" },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-brand-gray-200 bg-brand-navy-900 text-brand-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-sm bg-white text-brand-navy-900">
                <Cross className="size-4.5" strokeWidth={2.5} />
              </span>
              <span className="font-display text-lg text-white">Meridian Health</span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-brand-gray-400">
              A licensed international pharmacy providing over-the-counter, prescription, and wellness
              products with pharmacist-reviewed dispensing and worldwide logistics partners.
            </p>
            <div className="mt-5 space-y-2 text-xs text-brand-gray-400">
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-3.5 shrink-0" />
                <span>{company.addressLines.join(", ")}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="size-3.5 shrink-0" />
                <a href={`mailto:${company.supportEmail}`} className="hover:text-white">{company.supportEmail}</a>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="size-3.5 shrink-0" />
                {company.phone}
              </p>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">Shop</h3>
            <ul className="space-y-2.5 text-sm">
              {shopLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">Support</h3>
            <ul className="space-y-2.5 text-sm">
              {supportLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">Legal</h3>
            <ul className="space-y-2.5 text-sm">
              {legalLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 border-t border-white/10 pt-8 sm:grid-cols-4">
          <div className="flex items-center gap-2 text-xs text-brand-gray-400">
            <ShieldCheck className="size-4 text-brand-emerald-400" /> Licensed Pharmacy
          </div>
          <div className="flex items-center gap-2 text-xs text-brand-gray-400">
            <Lock className="size-4 text-brand-emerald-400" /> Secure Payments
          </div>
          <div className="flex items-center gap-2 text-xs text-brand-gray-400">
            <Stethoscope className="size-4 text-brand-emerald-400" /> Pharmacist Review
          </div>
          <div className="flex items-center gap-2 text-xs text-brand-gray-400">
            <Globe2 className="size-4 text-brand-emerald-400" /> International Delivery
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-brand-gray-500 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} Meridian Health. Educational content only — see our{" "}
            <Link href="/medical-disclaimer" className="underline hover:text-white">Medical Disclaimer</Link>.
          </p>
          <p>Headquartered in India · Serving customers worldwide</p>
        </div>
      </div>
    </footer>
  );
}
