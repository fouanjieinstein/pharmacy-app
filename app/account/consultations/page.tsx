import type { Metadata } from "next";
import { ConsultationsClient } from "@/app/account/consultations/consultations-client";

export const metadata: Metadata = { title: "My Consultations", robots: { index: false, follow: false } };

export default function AccountConsultationsPage() {
  return <ConsultationsClient />;
}
