"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { products } from "@/lib/data/products";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductFilters, DEFAULT_FILTERS, type FilterState } from "@/components/products/product-filters";
import { ProductSort, sortProducts, type SortOption } from "@/components/products/product-sort";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import type { ProductGroup } from "@/types";

export function ShopClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase() ?? "";
  const groupParam = searchParams.get("group") as ProductGroup | null;
  const categoryParam = searchParams.get("category");

  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTERS,
    groups: groupParam ? [groupParam] : [],
    categoryIds: categoryParam ? categoryParam.split(",") : [],
  });
  const [sort, setSort] = useState<SortOption>("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = products;

    if (query) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.genericName.toLowerCase().includes(query) ||
          p.activeIngredient.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query))
      );
    }
    if (filters.groups.length > 0) {
      list = list.filter((p) => filters.groups.includes(p.group));
    }
    if (filters.categoryIds.length > 0) {
      list = list.filter((p) => filters.categoryIds.includes(p.category));
    }
    list = list.filter((p) => p.priceUsd >= filters.minPrice && p.priceUsd <= filters.maxPrice);
    if (filters.inStockOnly) {
      list = list.filter((p) => p.inStock);
    }

    return sortProducts(list, sort);
  }, [query, filters, sort]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-emerald-600">Shop</p>
        <h1 className="font-display mt-1.5 text-3xl text-brand-navy-900">
          {query ? `Results for "${query}"` : "All Products"}
        </h1>
        <p className="mt-2 text-sm text-brand-gray-500">{filtered.length} products found</p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr]">
        <ProductFilters filters={filters} onChange={setFilters} className="hidden lg:block" />

        <div>
          <div className="mb-5 flex items-center justify-between gap-3">
            <Button variant="outline" size="sm" onClick={() => setMobileFiltersOpen(true)} className="lg:hidden">
              <SlidersHorizontal className="size-4" /> Filters
            </Button>
            <div className="ml-auto">
              <ProductSort value={sort} onChange={setSort} />
            </div>
          </div>
          <ProductGrid products={filtered} />
        </div>
      </div>

      <Modal open={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)} title="Filters">
        <ProductFilters filters={filters} onChange={setFilters} />
        <Button fullWidth className="mt-6" onClick={() => setMobileFiltersOpen(false)}>
          Show {filtered.length} results
        </Button>
      </Modal>
    </div>
  );
}
