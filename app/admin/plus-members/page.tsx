import type { Metadata } from "next";
import { Crown } from "lucide-react";
import { DataTable, type Column } from "@/components/admin/data-table";
import { adminCustomers, dashboardStats, type AdminCustomer } from "@/lib/data/admin-mock";
import { StatCard } from "@/components/admin/stat-card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Admin · Plus Members", robots: { index: false, follow: false } };

const columns: Column<AdminCustomer>[] = [
  { header: "Name", cell: (c) => <span className="font-medium">{c.name}</span> },
  { header: "Email", cell: (c) => c.email },
  { header: "Country", cell: (c) => c.country },
  { header: "Total Spent", cell: (c) => `$${c.totalSpentUsd.toFixed(2)}` },
  { header: "Plus Since", cell: (c) => new Date(c.joinedAt).toLocaleDateString() },
];

export default function AdminPlusMembersPage() {
  const plusMembers = adminCustomers.filter((c) => c.isPlusMember);

  return (
    <div>
      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Plus Members" value={dashboardStats.plusMembers.toLocaleString()} changePct={dashboardStats.plusMembersChangePct} icon={Crown} />
      </div>
      <h2 className="font-display mb-5 text-xl text-brand-navy-900">
        Plus Members <Badge variant="gold" className="ml-2">{plusMembers.length} shown</Badge>
      </h2>
      <DataTable columns={columns} rows={plusMembers} />
    </div>
  );
}
