"use client";

import Link from "next/link";
import { ArrowRight, Clock, FileCheck2, Droplet } from "lucide-react";
import type { LabTest } from "@/types";
import { getLabCategoryMeta, SAMPLE_TYPE_LABELS } from "@/lib/data/lab-tests";
import { useCurrency } from "@/lib/context/currency-context";
import { Badge } from "@/components/ui/badge";

export function LabTestCard({ test }: { test: LabTest }) {
  const { format } = useCurrency();
  const category = getLabCategoryMeta(test.category);

  return (
    <Link
      href={`/lab-tests/${test.slug}`}
      className="group flex flex-col rounded-md border border-brand-gray-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-brand-emerald-300 hover:shadow-md"
    >
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        <Badge variant="outline">{category?.label}</Badge>
        {test.requiresReferral && <Badge variant="gold">Referral Required</Badge>}
      </div>

      <h3 className="text-sm font-semibold leading-snug text-brand-navy-900">{test.name}</h3>
      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-brand-gray-500">{test.summary}</p>

      <dl className="mt-4 space-y-1.5 text-xs text-brand-gray-500">
        <div className="flex items-center gap-1.5">
          <Droplet className="size-3.5 shrink-0" />
          <dd>{SAMPLE_TYPE_LABELS[test.sampleType]}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="size-3.5 shrink-0" />
          <dd>
            Results in {test.turnaroundDays[0]}–{test.turnaroundDays[1]} days
          </dd>
        </div>
        <div className="flex items-center gap-1.5">
          <FileCheck2 className="size-3.5 shrink-0" />
          <dd>{test.panelIncludes.length} result groups</dd>
        </div>
      </dl>

      <div className="mt-4 flex items-center justify-between border-t border-brand-gray-100 pt-4">
        <div>
          <p className="text-xs text-brand-gray-500">Test fee</p>
          <p className="font-display text-lg text-brand-navy-900">{format(test.priceUsd)}</p>
        </div>
        <span className="flex items-center gap-1 text-sm font-medium text-brand-emerald-700">
          Book <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
