import type { Metadata } from "next";
import { PrescriptionClient } from "@/app/prescription/prescription-client";

export const metadata: Metadata = {
  title: "Upload Prescription",
  description: "Upload your prescription for review by a licensed pharmacist before your order is fulfilled.",
};

export default function PrescriptionPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
      <div className="mb-10 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-emerald-600">Prescription Verification</p>
        <h1 className="font-display mt-1.5 text-3xl text-brand-navy-900">Upload Your Prescription</h1>
        <p className="mt-3 text-sm leading-relaxed text-brand-gray-500">
          Prescription medications require a valid, current prescription. Upload a clear photo or scan and
          our licensed pharmacist team will review it before your order is processed. This is a prototype
          upload flow — no files are transmitted to a live server.
        </p>
      </div>
      <PrescriptionClient />
    </div>
  );
}
