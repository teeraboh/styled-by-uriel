import { notFound } from "next/navigation";
import { CollectionClient } from "@/components/product/collection-client";
import { getProducts, listCategories } from "@/lib/products";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;

  const [categories, products] = await Promise.all([
    listCategories(),
    getProducts({ categorySlug, limit: 50 }),
  ]);

  const category = categories.find(
    (c) => c.slug.toLowerCase() === categorySlug.toLowerCase()
  );

  if (!category) {
    notFound();
  }

  return (
    <CollectionClient
      category={category}
      categories={categories}
      products={products}
    />
  );
}

