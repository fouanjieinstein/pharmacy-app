import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Clock, Droplet, FileCheck2, Utensils, Home, Building2, Beaker } from "lucide-react";
import { labTests, getLabTestBySlug, getLabCategoryMeta, getRelatedLabTests, SAMPLE_TYPE_LABELS } from "@/lib/data/lab-tests";
import { LabBookingPanel } from "@/components/lab/lab-booking-panel";
import { LabTestCard } from "@/components/lab/lab-test-card";
import { Badge } from "@/components/ui/badge";

export function generateStaticParams() {
  return labTests.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata(props: PageProps<"/lab-tests/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const test = getLabTestBySlug(slug);
  if (!test) return { title: "Test Not Found" };
  return { title: test.name, description: test.summary };
}

export default async function LabTestDetailPage(props: PageProps<"/lab-tests/[slug]">) {
  const { slug } = await props.params;
  const test = getLabTestBySlug(slug);
  if (!test) notFound();

  const category = getLabCategoryMeta(test.category);
  const related = getRelatedLabTests(test);

  const facts = [
    { icon: Droplet, label: "Sample type", value: SAMPLE_TYPE_LABELS[test.sampleType] },
    { icon: Clock, label: "Turnaround", value: `${test.turnaroundDays[0]}–${test.turnaroundDays[1]} business days` },
    { icon: Utensils, label: "Fasting", value: test.fastingRequired ? "Required" : "Not required" },
    {
      icon: test.homeCollectionAvailable ? Home : Building2,
      label: "Collection",
      value: test.homeCollectionAvailable ? "Home visit or centre" : "Collection centre only",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-brand-gray-500">
        <Link href="/lab-tests" className="hover:text-brand-navy-900">Lab Tests</Link>
        <span>/</span>
        <span className="text-brand-navy-900">{test.shortName}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            <Badge variant="outline">{category?.label}</Badge>
            {test.requiresReferral && <Badge variant="gold">Referral Required</Badge>}
            {test.popular && <Badge variant="emerald">Frequently Requested</Badge>}
          </div>

          <h1 className="font-display text-3xl text-brand-navy-900">{test.name}</h1>
          <p className="mt-3 text-sm leading-relaxed text-brand-gray-600">{test.description}</p>

          <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {facts.map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-md border border-brand-gray-200 p-4">
                <Icon className="mb-2 size-4.5 text-brand-emerald-600" />
                <dt className="text-xs text-brand-gray-500">{label}</dt>
                <dd className="mt-0.5 text-sm font-medium text-brand-navy-900">{value}</dd>
              </div>
            ))}
          </dl>

          <section className="mt-10">
            <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-brand-navy-900">
              <FileCheck2 className="size-4.5 text-brand-emerald-600" />
              What&apos;s measured ({test.panelIncludes.length} groups)
            </h2>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {test.panelIncludes.map((item) => (
                <li
                  key={item}
                  className="rounded-sm border border-brand-gray-200 bg-brand-gray-50 px-3.5 py-2.5 text-sm text-brand-gray-700"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="mb-3 text-base font-semibold text-brand-navy-900">How to prepare</h2>
            <ul className="space-y-2">
              {test.preparation.map((step) => (
                <li key={step} className="flex gap-2.5 text-sm leading-relaxed text-brand-gray-600">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-emerald-600" />
                  {step}
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-10 flex items-start gap-3 rounded-md border border-brand-gray-200 bg-brand-gray-50 p-4">
            <Beaker className="mt-0.5 size-4.5 shrink-0 text-brand-gray-400" />
            <div className="text-xs leading-relaxed text-brand-gray-600">
              <p className="font-medium text-brand-navy-900">{test.processedBy}</p>
              <p className="mt-1">
                Results are released to your Meridian Health account and can be shared with your treating
                clinician. Lab results are best interpreted alongside your clinical history — book a
                consultation if you&apos;d like to review them with a doctor.
              </p>
            </div>
          </div>
        </div>

        <div>
          <LabBookingPanel test={test} />
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display mb-6 text-2xl text-brand-navy-900">Related Tests</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {related.map((t) => (
              <LabTestCard key={t.id} test={t} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
