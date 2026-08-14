"use client";

export type SortOption = "featured" | "price-asc" | "price-desc" | "popular" | "newest";

const OPTIONS: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "popular", label: "Popular" },
  { value: "newest", label: "Newest" },
];

export function ProductSort({ value, onChange }: { value: SortOption; onChange: (v: SortOption) => void }) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="product-sort" className="text-sm text-brand-gray-500 whitespace-nowrap">
        Sort by
      </label>
      <select
        id="product-sort"
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="h-10 rounded-sm border border-brand-gray-300 bg-white px-3 text-sm text-brand-navy-900 focus:border-brand-navy-900 focus:outline-none"
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function sortProducts<
  T extends { priceUsd: number; popularityScore: number; createdAt: string; featured: boolean; sponsored?: boolean },
>(products: T[], sort: SortOption): T[] {
  const copy = [...products];
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => a.priceUsd - b.priceUsd);
    case "price-desc":
      return copy.sort((a, b) => b.priceUsd - a.priceUsd);
    case "popular":
      return copy.sort((a, b) => b.popularityScore - a.popularityScore);
    case "newest":
      return copy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case "featured":
    default:
      return copy.sort(
        (a, b) =>
          Number(b.sponsored) - Number(a.sponsored) ||
          Number(b.featured) - Number(a.featured) ||
          b.popularityScore - a.popularityScore
      );
  }
}
