import { getProducts, listCategories } from "@/lib/products";
import { ShopClient } from "@/components/product/shop-client";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
    getProducts({ limit: 100 }),
    listCategories(),
  ]);

  return <ShopClient initialProducts={products} categories={categories} />;
}
