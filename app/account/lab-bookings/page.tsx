import type { Metadata } from "next";
import { LabBookingsClient } from "@/app/account/lab-bookings/lab-bookings-client";

export const metadata: Metadata = { title: "My Lab Bookings", robots: { index: false, follow: false } };

export default function AccountLabBookingsPage() {
  return <LabBookingsClient />;
}
