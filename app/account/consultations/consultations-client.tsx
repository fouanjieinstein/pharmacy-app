"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Stethoscope } from "lucide-react";
import { listConsultations, cancelConsultation } from "@/lib/services/consultation-service";
import { doctors } from "@/lib/data/doctors";
import { useCurrency } from "@/lib/context/currency-context";
import { useToast } from "@/lib/context/toast-context";
import type { Consultation } from "@/types";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { CardListSkeleton } from "@/components/ui/skeleton";

export function ConsultationsClient() {
  const { showToast } = useToast();
  const { format } = useCurrency();
  const [items, setItems] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = () => listConsultations().then(setItems).catch(() => showToast("Couldn't load consultations.", "error"));

  useEffect(() => {
    refresh().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <CardListSkeleton count={3} />;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<Stethoscope className="size-10" />}
        title="No consultations booked yet"
        description="Book a video consultation with one of our licensed physicians."
        action={
          <Link href="/consult" className={buttonVariants({ size: "lg" })}>
            Find a Doctor
          </Link>
        }
      />
    );
  }

  return (
    <div className="animate-fade-in space-y-3">
      {items.map((c) => {
        const doctor = doctors.find((d) => d.id === c.doctorId);
        return (
          <Card key={c.id}>
            <CardBody className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-brand-navy-900">{doctor?.name ?? "Doctor"}</p>
                <p className="text-xs text-brand-gray-500">
                  {new Date(c.slot).toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                  {" · "}
                  {format(c.feeUsd)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={c.status === "scheduled" ? "emerald" : c.status === "cancelled" ? "red" : "gray"}>
                  {c.status}
                </Badge>
                {c.status === "scheduled" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      cancelConsultation(c.id)
                        .then(refresh)
                        .catch((err) => showToast(err instanceof Error ? err.message : "Couldn't cancel.", "error"))
                    }
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}
