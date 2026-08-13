"use client";

import { useEffect, useState } from "react";
import { DataTable, type Column } from "@/components/admin/data-table";
import { adminOrders, type AdminOrderRow } from "@/lib/data/admin-mock";
import { listOrders, ORDER_STATUS_SEQUENCE } from "@/lib/services/order-service";
import { getCountry } from "@/lib/data/countries";
import { formatMoney } from "@/lib/data/currencies";
import { Badge } from "@/components/ui/badge";

export function AdminOrdersClient() {
  const [rows, setRows] = useState<AdminOrderRow[]>(adminOrders);

  useEffect(() => {
    // Scoped to whichever account is currently signed in — there's no
    // admin-wide "all customers' orders" endpoint yet, so this blends with
    // the mock adminOrders rows below, same as before.
    listOrders()
      .then((liveOrders) => {
        setRows([
          ...liveOrders.map((o) => ({
            id: o.id,
            orderNumber: o.orderNumber,
            customerName: o.shippingAddress.fullName,
            country: getCountry(o.destinationCountry).name,
            itemCount: o.items.length,
            totalUsd: o.totalUsd,
            status: ORDER_STATUS_SEQUENCE.find((s) => s.status === o.status)?.label ?? o.status,
            placedAt: o.placedAt,
            hasRx: Boolean(o.prescriptionId),
          })),
          ...adminOrders,
        ]);
      })
      .catch(() => setRows(adminOrders));
  }, []);

  const columns: Column<AdminOrderRow>[] = [
    { header: "Order #", cell: (r) => <span className="font-medium">{r.orderNumber}</span> },
    { header: "Customer", cell: (r) => r.customerName },
    { header: "Country", cell: (r) => r.country },
    { header: "Items", cell: (r) => r.itemCount },
    { header: "Total", cell: (r) => formatMoney(r.totalUsd, "USD") },
    { header: "Status", cell: (r) => <Badge variant="emerald">{r.status}</Badge> },
    { header: "Rx", cell: (r) => (r.hasRx ? <Badge variant="gold">Yes</Badge> : "—") },
    { header: "Placed", cell: (r) => new Date(r.placedAt).toLocaleDateString() },
  ];

  return <DataTable columns={columns} rows={rows} />;
}
