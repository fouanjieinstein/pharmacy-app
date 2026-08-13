"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Star, Languages, ArrowRight, CalendarClock } from "lucide-react";
import type { Doctor } from "@/types";
import { DoctorAvatar } from "@/components/consult/doctor-avatar";
import { getSpecialtyMeta } from "@/lib/data/doctors";
import { useCurrency } from "@/lib/context/currency-context";
import { nextAvailable } from "@/lib/utils/availability";

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  const { format } = useCurrency();
  const specialty = getSpecialtyMeta(doctor.specialty);

  // Date-dependent, so resolve after mount to keep hydration consistent.
  const [nextSlot, setNextSlot] = useState<string | null>(null);
  useEffect(() => setNextSlot(nextAvailable(`consult-${doctor.id}`)), [doctor.id]);

  return (
    <Link
      href={`/consult/${doctor.slug}`}
      className="group flex flex-col rounded-md border border-brand-gray-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-brand-emerald-300 hover:shadow-md"
    >
      <div className="flex items-start gap-4">
        <DoctorAvatar name={doctor.name} seed={doctor.avatarSeed} className="size-14 shrink-0 text-lg" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-brand-navy-900">{doctor.name}</p>
          <p className="text-xs text-brand-gray-500">{specialty?.label}</p>
          <p className="mt-0.5 text-xs text-brand-gray-400">{doctor.qualifications}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3 text-xs text-brand-gray-500">
        <span className="flex items-center gap-1">
          <Star className="size-3.5 fill-brand-gold-500 text-brand-gold-500" />
          {doctor.rating.toFixed(1)} ({doctor.reviewCount})
        </span>
        <span>{doctor.experienceYears} yrs exp.</span>
      </div>

      <div className="mt-1.5 flex items-center gap-1.5 text-xs text-brand-gray-500">
        <Languages className="size-3.5" />
        {doctor.languages.join(", ")}
      </div>

      <div className="mt-1.5 flex h-4 items-center gap-1.5 text-xs">
        {nextSlot && (
          <>
            <CalendarClock className="size-3.5 text-brand-emerald-600" />
            <span className="text-brand-emerald-700">
              Next available{" "}
              {new Date(nextSlot).toLocaleString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
          </>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-brand-gray-100 pt-4">
        <div>
          <p className="text-xs text-brand-gray-500">Consultation fee</p>
          <p className="font-display text-lg text-brand-navy-900">{format(doctor.consultationFeeUsd)}</p>
        </div>
        <span className="flex items-center gap-1 text-sm font-medium text-brand-emerald-700">
          Book Now <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
