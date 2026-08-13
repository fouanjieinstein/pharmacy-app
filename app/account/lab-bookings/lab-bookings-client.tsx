"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FlaskConical, Home, Building2 } from "lucide-react";
import { useCurrency } from "@/lib/context/currency-context";
import { useToast } from "@/lib/context/toast-context";
import { listLabBookings, cancelLabBooking, LAB_BOOKING_STATUS_LABELS } from "@/lib/services/lab-booking-service";
import { getLabTestById } from "@/lib/data/lab-tests";
import type { LabBooking } from "@/types";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

const STATUS_VARIANT: Record<LabBooking["status"], "emerald" | "navy" | "gold" | "red" | "gray"> = {
  scheduled: "emerald",
  "sample-collected": "navy",
  processing: "gold",
  "report-ready": "emerald",
  cancelled: "red",
};

export function LabBookingsClient() {
  const { format } = useCurrency();
  const { showToast } = useToast();
  const [items, setItems] = useState<LabBooking[]>([]);

  const refresh = () => listLabBookings().then(setItems).catch(() => showToast("Couldn't load lab bookings.", "error"));

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<FlaskConical className="size-10" />}
        title="No lab tests booked yet"
        description="Browse our specialist diagnostic panels and book a collection slot."
        action={
          <Link href="/lab-tests" className={buttonVariants({ size: "lg" })}>
            Browse Lab Tests
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-3">
      {items.map((b) => {
        const tests = b.testIds.map((id) => getLabTestById(id)).filter(Boolean);
        const ModeIcon = b.collectionMode === "home-visit" ? Home : Building2;
        return (
          <Card key={b.id}>
            <CardBody>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-brand-navy-900">
                    {tests.map((t) => t?.shortName).join(", ") || "Lab test"}
                  </p>
                  <p className="mt-0.5 text-xs text-brand-gray-500">
                    Ref {b.reference} ·{" "}
                    {new Date(b.slot).toLocaleString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-brand-gray-500">
                    <ModeIcon className="size-3.5" />
                    {b.collectionMode === "home-visit" ? "Home collection" : "Collection centre"}
                    {" · "}
                    {format(b.totalUsd)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={STATUS_VARIANT[b.status]}>{LAB_BOOKING_STATUS_LABELS[b.status]}</Badge>
                  {b.status === "scheduled" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        cancelLabBooking(b.id)
                          .then(refresh)
                          .catch((err) => showToast(err instanceof Error ? err.message : "Couldn't cancel.", "error"))
                      }
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}
