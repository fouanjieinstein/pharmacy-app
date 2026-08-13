import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Star, Languages, GraduationCap } from "lucide-react";
import { doctors, getDoctorBySlug, getSpecialtyMeta } from "@/lib/data/doctors";
import { DoctorAvatar } from "@/components/consult/doctor-avatar";
import { ConsultBookingPanel } from "@/components/consult/consult-booking-panel";

export function generateStaticParams() {
  return doctors.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata(props: PageProps<"/consult/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const doctor = getDoctorBySlug(slug);
  if (!doctor) return { title: "Doctor Not Found" };
  return { title: doctor.name, description: doctor.bio };
}

export default async function DoctorProfilePage(props: PageProps<"/consult/[slug]">) {
  const { slug } = await props.params;
  const doctor = getDoctorBySlug(slug);
  if (!doctor) notFound();

  const specialty = getSpecialtyMeta(doctor.specialty);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-brand-gray-500">
        <Link href="/consult" className="hover:text-brand-navy-900">Doctor Consult</Link>
        <span>/</span>
        <span className="text-brand-navy-900">{doctor.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="flex items-start gap-5">
            <DoctorAvatar name={doctor.name} seed={doctor.avatarSeed} className="size-20 shrink-0 text-2xl" />
            <div>
              <h1 className="font-display text-2xl text-brand-navy-900">{doctor.name}</h1>
              <p className="mt-1 text-sm text-brand-emerald-700">{specialty?.label}</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-brand-gray-500">
                <span className="flex items-center gap-1">
                  <Star className="size-3.5 fill-brand-gold-500 text-brand-gold-500" />
                  {doctor.rating.toFixed(1)} ({doctor.reviewCount} reviews)
                </span>
                <span className="flex items-center gap-1">
                  <GraduationCap className="size-3.5" /> {doctor.qualifications}
                </span>
                <span className="flex items-center gap-1">
                  <Languages className="size-3.5" /> {doctor.languages.join(", ")}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="mb-2 text-base font-semibold text-brand-navy-900">About</h2>
            <p className="text-sm leading-relaxed text-brand-gray-600">{doctor.bio}</p>
          </div>

          <div className="mt-8">
            <h2 className="mb-2 text-base font-semibold text-brand-navy-900">Experience</h2>
            <p className="text-sm text-brand-gray-600">{doctor.experienceYears} years of clinical practice</p>
          </div>
        </div>

        <div>
          <ConsultBookingPanel doctor={doctor} />
        </div>
      </div>
    </div>
  );
}
