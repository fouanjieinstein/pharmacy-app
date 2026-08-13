"use client";

import { categories } from "@/lib/data/categories";
import { products } from "@/lib/data/products";
import type { ProductGroup } from "@/types";
import { cn } from "@/lib/utils/cn";

const MAX_PRODUCT_PRICE = Math.ceil(Math.max(...products.map((p) => p.priceUsd)) / 10) * 10;

export interface FilterState {
  groups: ProductGroup[];
  categoryIds: string[];
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
}

export const GROUP_LABELS: Record<ProductGroup, string> = {
  otc: "Over-the-Counter",
  prescription: "Prescription",
  wellness: "Wellness & Preventive",
};

export function ProductFilters({
  filters,
  onChange,
  className,
}: {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  className?: string;
}) {
  const toggleGroup = (group: ProductGroup) => {
    const groups = filters.groups.includes(group)
      ? filters.groups.filter((g) => g !== group)
      : [...filters.groups, group];
    onChange({ ...filters, groups });
  };

  const toggleCategory = (id: string) => {
    const categoryIds = filters.categoryIds.includes(id)
      ? filters.categoryIds.filter((c) => c !== id)
      : [...filters.categoryIds, id];
    onChange({ ...filters, categoryIds });
  };

  const reset = () =>
    onChange({ groups: [], categoryIds: [], minPrice: 0, maxPrice: MAX_PRODUCT_PRICE, inStockOnly: false });

  return (
    <aside className={cn("space-y-7", className)}>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-base text-brand-navy-900">Filters</h2>
        <button onClick={reset} className="text-xs font-medium text-brand-emerald-700 hover:underline">
          Reset all
        </button>
      </div>

      <fieldset>
        <legend className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-brand-gray-500">
          Prescription Status
        </legend>
        <div className="space-y-2">
          {(Object.keys(GROUP_LABELS) as ProductGroup[]).map((group) => (
            <label key={group} className="flex cursor-pointer items-center gap-2.5 text-sm text-brand-navy-900">
              <input
                type="checkbox"
                checked={filters.groups.includes(group)}
                onChange={() => toggleGroup(group)}
                className="size-4 rounded-sm border-brand-gray-300 text-brand-emerald-600 focus-visible:ring-brand-emerald-600"
              />
              {GROUP_LABELS[group]}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-brand-gray-500">
          Category
        </legend>
        <div className="scrollbar-thin max-h-64 space-y-2 overflow-y-auto pr-1">
          {categories.map((cat) => (
            <label key={cat.id} className="flex cursor-pointer items-start gap-2.5 text-sm text-brand-navy-900">
              <input
                type="checkbox"
                checked={filters.categoryIds.includes(cat.id)}
                onChange={() => toggleCategory(cat.id)}
                className="mt-0.5 size-4 rounded-sm border-brand-gray-300 text-brand-emerald-600 focus-visible:ring-brand-emerald-600"
              />
              {cat.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-brand-gray-500">
          Price Range (USD)
        </legend>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            value={filters.minPrice}
            onChange={(e) => onChange({ ...filters, minPrice: Number(e.target.value) })}
            aria-label="Minimum price"
            className="h-9 w-full rounded-sm border border-brand-gray-300 px-2.5 text-sm focus:border-brand-navy-900 focus:outline-none"
          />
          <span className="text-brand-gray-400">–</span>
          <input
            type="number"
            min={0}
            value={filters.maxPrice}
            onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
            aria-label="Maximum price"
            className="h-9 w-full rounded-sm border border-brand-gray-300 px-2.5 text-sm focus:border-brand-navy-900 focus:outline-none"
          />
        </div>
      </fieldset>

      <fieldset>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-brand-navy-900">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => onChange({ ...filters, inStockOnly: e.target.checked })}
            className="size-4 rounded-sm border-brand-gray-300 text-brand-emerald-600 focus-visible:ring-brand-emerald-600"
          />
          In stock only
        </label>
      </fieldset>
    </aside>
  );
}

export const DEFAULT_FILTERS: FilterState = {
  groups: [],
  categoryIds: [],
  minPrice: 0,
  maxPrice: MAX_PRODUCT_PRICE,
  inStockOnly: false,
};
