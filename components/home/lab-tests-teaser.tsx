import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPopularLabTests } from "@/lib/data/lab-tests";
import { LabTestCard } from "@/components/lab/lab-test-card";

export function LabTestsTeaser() {
  const tests = getPopularLabTests(3);

  return (
    <section className="bg-brand-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-emerald-600">Diagnostics</p>
            <h2 className="font-display mt-1.5 text-2xl text-brand-navy-900 sm:text-3xl">
              Specialist Lab Testing, at Home
            </h2>
          </div>
          <Link
            href="/lab-tests"
            className="hidden items-center gap-1 text-sm font-medium text-brand-emerald-700 hover:underline sm:inline-flex"
          >
            Browse all tests <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {tests.map((test) => (
            <LabTestCard key={test.id} test={test} />
          ))}
        </div>
      </div>
    </section>
  );
}
