import type { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";
import { ContactClient } from "@/app/contact/contact-client";
import { company } from "@/lib/data/company";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Meridian Health customer support.",
};

const details = [
  { icon: Mail, label: "Email", value: company.supportEmail },
  { icon: Phone, label: "Phone", value: company.phone },
  { icon: MapPin, label: "Headquarters", value: company.addressLines.join(", ") },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-emerald-600">Contact Us</p>
      <h1 className="font-display mt-1.5 text-3xl text-brand-navy-900">We&apos;re Here to Help</h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-brand-gray-500">
        Questions about an order, a prescription, or shipping eligibility? Reach out and our support team
        will get back to you.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
        <ContactClient />

        <div className="space-y-4">
          {details.map((d) => (
            <div key={d.label} className="flex items-start gap-3 rounded-md border border-brand-gray-200 p-4">
              <d.icon className="size-4.5 shrink-0 text-brand-emerald-600" />
              <div>
                <p className="text-xs text-brand-gray-500">{d.label}</p>
                <p className="text-sm font-medium text-brand-navy-900">{d.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
