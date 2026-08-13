"use client";

import { useMemo, useState } from "react";
import { labTests, labCategories } from "@/lib/data/lab-tests";
import { LabTestCard } from "@/components/lab/lab-test-card";
import { cn } from "@/lib/utils/cn";

type LabSort = "featured" | "price-asc" | "price-desc" | "fastest";

const SORT_LABELS: { value: LabSort; label: string }[] = [
  { value: "featured", label: "Most Requested" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "fastest", label: "Fastest Turnaround" },
];

export function LabTestsClient() {
  const [active, setActive] = useState<string | null>(null);
  const [sort, setSort] = useState<LabSort>("featured");
  const [referralOnly, setReferralOnly] = useState(false);
  const [homeOnly, setHomeOnly] = useState(false);

  const filtered = useMemo(() => {
    let list = labTests;
    if (active) list = list.filter((t) => t.category === active);
    if (referralOnly) list = list.filter((t) => !t.requiresReferral);
    if (homeOnly) list = list.filter((t) => t.homeCollectionAvailable);

    const copy = [...list];
    switch (sort) {
      case "price-asc":
        return copy.sort((a, b) => a.priceUsd - b.priceUsd);
      case "price-desc":
        return copy.sort((a, b) => b.priceUsd - a.priceUsd);
      case "fastest":
        return copy.sort((a, b) => a.turnaroundDays[1] - b.turnaroundDays[1]);
      default:
        return copy.sort((a, b) => Number(b.popular) - Number(a.popular) || b.priceUsd - a.priceUsd);
    }
  }, [active, sort, referralOnly, homeOnly]);

  return (
    <div>
      <div className="scrollbar-thin mb-6 flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActive(null)}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
            active === null ? "bg-brand-navy-900 text-white" : "bg-brand-gray-100 text-brand-navy-900 hover:bg-brand-gray-200"
          )}
        >
          All Categories
        </button>
        {labCategories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActive(c.id)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              active === c.id ? "bg-brand-navy-900 text-white" : "bg-brand-gray-100 text-brand-navy-900 hover:bg-brand-gray-200"
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-y border-brand-gray-200 py-3">
        <div className="flex flex-wrap items-center gap-5">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-brand-navy-900">
            <input
              type="checkbox"
              checked={referralOnly}
              onChange={(e) => setReferralOnly(e.target.checked)}
              className="size-4 rounded-sm border-brand-gray-300 text-brand-emerald-600"
            />
            No referral needed
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-brand-navy-900">
            <input
              type="checkbox"
              checked={homeOnly}
              onChange={(e) => setHomeOnly(e.target.checked)}
              className="size-4 rounded-sm border-brand-gray-300 text-brand-emerald-600"
            />
            Home collection available
          </label>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="lab-sort" className="whitespace-nowrap text-sm text-brand-gray-500">
            Sort by
          </label>
          <select
            id="lab-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as LabSort)}
            className="h-10 rounded-sm border border-brand-gray-300 bg-white px-3 text-sm text-brand-navy-900 focus:border-brand-navy-900 focus:outline-none"
          >
            {SORT_LABELS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="mb-5 text-sm text-brand-gray-500">{filtered.length} tests available</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((test) => (
          <LabTestCard key={test.id} test={test} />
        ))}
      </div>
    </div>
  );
}
