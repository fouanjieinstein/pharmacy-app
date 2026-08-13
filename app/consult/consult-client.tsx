"use client";

import { useMemo, useState } from "react";
import { doctors, specialties } from "@/lib/data/doctors";
import { DoctorCard } from "@/components/consult/doctor-card";
import { cn } from "@/lib/utils/cn";

export function ConsultClient() {
  const [active, setActive] = useState<string | null>(null);

  const filtered = useMemo(
    () => (active ? doctors.filter((d) => d.specialty === active) : doctors),
    [active]
  );

  return (
    <div>
      <div className="scrollbar-thin mb-8 flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActive(null)}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
            active === null ? "bg-brand-navy-900 text-white" : "bg-brand-gray-100 text-brand-navy-900 hover:bg-brand-gray-200"
          )}
        >
          All Specialties
        </button>
        {specialties.map((s) => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              active === s.id ? "bg-brand-navy-900 text-white" : "bg-brand-gray-100 text-brand-navy-900 hover:bg-brand-gray-200"
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <p className="mb-5 text-sm text-brand-gray-500">{filtered.length} doctors available</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>
    </div>
  );
}
