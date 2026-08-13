"use client";

import { useEffect, useState } from "react";
import { DataTable, type Column } from "@/components/admin/data-table";
import { adminLabBookings, type AdminLabBooking } from "@/lib/data/admin-mock";
import { listLabBookings, LAB_BOOKING_STATUS_LABELS } from "@/lib/services/lab-booking-service";
import { getLabTestById } from "@/lib/data/lab-tests";
import { Badge } from "@/components/ui/badge";

const STATUS_VARIANT: Record<string, "emerald" | "navy" | "gold" | "red" | "gray"> = {
  Scheduled: "emerald",
  "Sample Collected": "navy",
  Processing: "gold",
  "Report Ready": "emerald",
  Cancelled: "red",
};

const columns: Column<AdminLabBooking>[] = [
  { header: "Reference", cell: (b) => <span className="font-medium">{b.reference}</span> },
  { header: "Patient", cell: (b) => b.patientName },
  { header: "Test", cell: (b) => b.testName },
  { header: "Collection", cell: (b) => b.collectionMode },
  { header: "Slot", cell: (b) => new Date(b.slot).toLocaleString() },
  { header: "Total", cell: (b) => `$${b.totalUsd.toFixed(2)}` },
  { header: "Status", cell: (b) => <Badge variant={STATUS_VARIANT[b.status] ?? "gray"}>{b.status}</Badge> },
];

export function AdminLabBookingsClient() {
  const [rows, setRows] = useState<AdminLabBooking[]>(adminLabBookings);

  useEffect(() => {
    // Scoped to whichever account is currently signed in — there's no
    // admin-wide "all customers' bookings" endpoint yet, so this blends with
    // the mock adminLabBookings rows below, same as admin/orders.
    listLabBookings()
      .then((liveBookings) => {
        const live = liveBookings.map<AdminLabBooking>((b) => ({
          id: b.id,
          reference: b.reference,
          patientName: "Aanya Sharma",
          testName: b.testIds.map((id) => getLabTestById(id)?.shortName ?? "Lab test").join(", "),
          collectionMode: b.collectionMode === "home-visit" ? "Home visit" : "Collection centre",
          slot: b.slot,
          totalUsd: b.totalUsd,
          status: LAB_BOOKING_STATUS_LABELS[b.status] as AdminLabBooking["status"],
        }));
        setRows([...live, ...adminLabBookings]);
      })
      .catch(() => setRows(adminLabBookings));
  }, []);

  return <DataTable columns={columns} rows={rows} />;
}
