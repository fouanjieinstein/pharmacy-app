import type { Metadata } from "next";
import { Stethoscope } from "lucide-react";
import { ConsultClient } from "@/app/consult/consult-client";

export const metadata: Metadata = {
  title: "Doctor Consultations",
  description: "Book an online consultation with a licensed physician across a range of specialties.",
};

export default function ConsultPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <div className="mb-10 max-w-2xl">
        <span className="mb-3 inline-flex size-11 items-center justify-center rounded-full bg-brand-emerald-50 text-brand-emerald-600">
          <Stethoscope className="size-5.5" />
        </span>
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-emerald-600">Doctor Consult</p>
        <h1 className="font-display mt-1.5 text-3xl text-brand-navy-900">Talk to a Licensed Doctor Online</h1>
        <p className="mt-3 text-sm leading-relaxed text-brand-gray-500">
          Book a video consultation with a physician across general medicine and specialist care.
        </p>
      </div>

      <ConsultClient />
    </div>
  );
}
