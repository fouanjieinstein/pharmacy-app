import type { Metadata } from "next";
import { AdminOrdersClient } from "@/app/admin/orders/orders-client";

export const metadata: Metadata = { title: "Admin · Orders", robots: { index: false, follow: false } };

export default function AdminOrdersPage() {
  return (
    <div>
      <h2 className="font-display mb-5 text-xl text-brand-navy-900">Orders</h2>
      <AdminOrdersClient />
    </div>
  );
}
