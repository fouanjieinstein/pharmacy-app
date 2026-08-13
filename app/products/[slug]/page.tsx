import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, getRelatedProducts, products } from "@/lib/data/products";
import { getCategoryMeta } from "@/lib/data/categories";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductPurchasePanel } from "@/components/products/product-purchase-panel";
import { ProductTabs } from "@/components/products/product-tabs";
import { ProductGrid } from "@/components/products/product-grid";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.description,
    openGraph: { title: product.name, description: product.description },
  };
}

export default async function ProductDetailPage(props: PageProps<"/products/[slug]">) {
  const { slug } = await props.params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const category = getCategoryMeta(product.category);
  const related = getRelatedProducts(product);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-brand-gray-500">
        <Link href="/shop" className="hover:text-brand-navy-900">Shop</Link>
        <span>/</span>
        {category && (
          <>
            <Link href={`/categories/${category.id}`} className="hover:text-brand-navy-900">{category.label}</Link>
            <span>/</span>
          </>
        )}
        <span className="text-brand-navy-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <ProductGallery images={product.images} group={product.group} name={product.name} />
        <ProductPurchasePanel product={product} />
      </div>

      <div className="mt-14 max-w-4xl">
        <ProductTabs product={product} />
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display mb-6 text-2xl text-brand-navy-900">You May Also Need</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
