import type { Metadata } from "next";
import { InventoryClient } from "@/app/admin/inventory/inventory-client";

export const metadata: Metadata = { title: "Admin · Inventory", robots: { index: false, follow: false } };

export default function AdminInventoryPage() {
  return (
    <div>
      <h2 className="font-display mb-5 text-xl text-brand-navy-900">Inventory</h2>
      <InventoryClient />
    </div>
  );
}
