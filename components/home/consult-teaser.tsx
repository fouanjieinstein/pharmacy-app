import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { doctors } from "@/lib/data/doctors";
import { DoctorCard } from "@/components/consult/doctor-card";

export function ConsultTeaser() {
  const topDoctors = [...doctors].sort((a, b) => b.rating - a.rating).slice(0, 3);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-emerald-600">Doctor Consult</p>
          <h2 className="font-display mt-1.5 text-2xl text-brand-navy-900 sm:text-3xl">Talk to a Doctor, Today</h2>
        </div>
        <Link href="/consult" className="hidden items-center gap-1 text-sm font-medium text-brand-emerald-700 hover:underline sm:inline-flex">
          View all specialties <ArrowRight className="size-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {topDoctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>
    </section>
  );
}
