import type { Metadata } from "next";
import { AdminLabBookingsClient } from "@/app/admin/lab-bookings/lab-bookings-client";

export const metadata: Metadata = { title: "Admin · Lab Bookings", robots: { index: false, follow: false } };

export default function AdminLabBookingsPage() {
  return (
    <div>
      <h2 className="font-display mb-5 text-xl text-brand-navy-900">Lab Bookings</h2>
      <AdminLabBookingsClient />
    </div>
  );
}
