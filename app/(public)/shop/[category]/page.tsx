import { notFound } from "next/navigation";
import { CollectionClient } from "@/components/product/collection-client";
import { COLLECTIONS, getCollection } from "@/lib/collections";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const collection = getCollection(category);

  if (!collection) {
    notFound();
  }

  return <CollectionClient collection={collection} collections={COLLECTIONS} />;
}
