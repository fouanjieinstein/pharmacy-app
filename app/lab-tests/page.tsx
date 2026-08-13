import type { Metadata } from "next";
import { FlaskConical, Home, ShieldCheck, Clock } from "lucide-react";
import { LabTestsClient } from "@/app/lab-tests/lab-tests-client";
import { labTests, HOME_COLLECTION_FEE_USD } from "@/lib/data/lab-tests";

export const metadata: Metadata = {
  title: "Lab Tests",
  description:
    "Book specialised diagnostic lab tests — genomic, autoimmune, hormone, toxicology, and microbiome panels — with home sample collection.",
};

const highlights = [
  { icon: FlaskConical, title: `${labTests.length} specialist panels`, description: "Including tests most general laboratories don't offer." },
  { icon: Home, title: "Home sample collection", description: `A phlebotomist comes to you for ${HOME_COLLECTION_FEE_USD > 0 ? `$${HOME_COLLECTION_FEE_USD}` : "free"} — free for Meridian Plus members.` },
  { icon: Clock, title: "Tracked turnaround", description: "Every panel lists its expected reporting window up front." },
  { icon: ShieldCheck, title: "Accredited laboratories", description: "Processed through our accredited reference and partner labs." },
];

export default function LabTestsPage() {
  return (
    <div>
      <div className="relative overflow-hidden bg-brand-navy-900 py-16">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "radial-gradient(white 1px, transparent 1px)", backgroundSize: "22px 22px" }}
        />
        <div className="absolute -right-24 -top-24 size-72 rounded-full bg-brand-emerald-600/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <span className="mb-3 inline-flex size-11 items-center justify-center rounded-full bg-white/10 text-brand-emerald-300">
            <FlaskConical className="size-5.5" />
          </span>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-emerald-400">Diagnostics</p>
          <h1 className="font-display mt-1.5 text-3xl text-white sm:text-4xl">Specialist Lab Testing, Booked in Minutes</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-brand-gray-300">
            Genomic sequencing, advanced cardiovascular risk, autoimmune antibody panels, hormone
            metabolite profiling, toxicology, and microbiome sequencing — including specialised assays
            that are difficult to source through routine pathology.
          </p>

          <dl className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex items-start gap-3 rounded-md border border-white/10 bg-white/5 p-4">
                <Icon className="size-5 shrink-0 text-brand-emerald-400" />
                <div>
                  <dt className="text-sm font-semibold text-white">{title}</dt>
                  <dd className="mt-1 text-xs text-brand-gray-400">{description}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <LabTestsClient />
      </div>
    </div>
  );
}
