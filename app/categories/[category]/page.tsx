import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories, getCategoryMeta } from "@/lib/data/categories";
import { getProductsByCategory } from "@/lib/data/products";
import { CategoryProductsClient } from "@/components/products/category-products-client";
import { Badge } from "@/components/ui/badge";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.id }));
}

export async function generateMetadata(props: PageProps<"/categories/[category]">): Promise<Metadata> {
  const { category } = await props.params;
  const meta = getCategoryMeta(category);
  if (!meta) return { title: "Category Not Found" };
  return { title: meta.label, description: meta.description };
}

const GROUP_BADGE = {
  otc: { label: "Over-the-Counter", variant: "emerald" as const },
  prescription: { label: "Prescription Required", variant: "gold" as const },
  wellness: { label: "Wellness & Preventive", variant: "navy" as const },
};

export default async function CategoryPage(props: PageProps<"/categories/[category]">) {
  const { category } = await props.params;
  const meta = getCategoryMeta(category);
  if (!meta) notFound();

  const productsInCategory = getProductsByCategory(category);
  const badge = GROUP_BADGE[meta.group];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <div className="mb-8 max-w-2xl">
        <Badge variant={badge.variant}>{badge.label}</Badge>
        <h1 className="font-display mt-3 text-3xl text-brand-navy-900">{meta.label}</h1>
        <p className="mt-2 text-sm leading-relaxed text-brand-gray-500">{meta.description}</p>
      </div>
      <CategoryProductsClient products={productsInCategory} />
    </div>
  );
}
