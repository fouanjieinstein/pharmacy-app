import type { Metadata } from "next";
import { PrescriptionClient } from "@/app/prescription/prescription-client";

export const metadata: Metadata = { title: "My Prescriptions", robots: { index: false, follow: false } };

export default function AccountPrescriptionsPage() {
  return <PrescriptionClient />;
}
