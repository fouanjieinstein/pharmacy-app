import type { Metadata } from "next";
import { DataTable, type Column } from "@/components/admin/data-table";
import { adminCustomers, type AdminCustomer } from "@/lib/data/admin-mock";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Admin · Customers", robots: { index: false, follow: false } };

const columns: Column<AdminCustomer>[] = [
  { header: "Name", cell: (c) => <span className="font-medium">{c.name}</span> },
  { header: "Email", cell: (c) => c.email },
  { header: "Country", cell: (c) => c.country },
  { header: "Orders", cell: (c) => c.ordersCount },
  { header: "Total Spent", cell: (c) => `$${c.totalSpentUsd.toFixed(2)}` },
  { header: "Joined", cell: (c) => new Date(c.joinedAt).toLocaleDateString() },
  { header: "Plus", cell: (c) => (c.isPlusMember ? <Badge variant="gold">Plus Member</Badge> : "—") },
  { header: "Status", cell: (c) => <Badge variant={c.status === "active" ? "emerald" : "red"}>{c.status}</Badge> },
];

export default function AdminCustomersPage() {
  return (
    <div>
      <h2 className="font-display mb-5 text-xl text-brand-navy-900">Customers</h2>
      <DataTable columns={columns} rows={adminCustomers} />
    </div>
  );
}
