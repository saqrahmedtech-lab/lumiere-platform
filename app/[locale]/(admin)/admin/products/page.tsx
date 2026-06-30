import Link from "next/link";
import { IconPlus, IconBox } from "@tabler/icons-react";
import { getStoreProducts } from "@/utils/supabase/queries/get-store-products";
import { Button } from "@/components/ui/button";
import { ProductsTable } from "./components/products-table";

export default async function ProductsPage() {
  const products = await getStoreProducts();

  return (
    <div className="w-full lg:px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary-light text-tide shrink-0">
              <IconBox size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-text-primary">
                Products
              </h1>
              <p className="mt-0.5 text-sm text-text-secondary">
                {products.length} product{products.length !== 1 ? "s" : ""} in
                your store.
              </p>
            </div>
          </div>
          <Button asChild className="bg-tide text-pearl hover:bg-tide/90">
            <Link href="/admin/products/new">
              <IconPlus className="size-4" />
              Add product
            </Link>
          </Button>
        </div>

        <ProductsTable products={products} />
      </div>
    </div>
  );
}
