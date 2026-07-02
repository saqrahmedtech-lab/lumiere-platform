import { IconBox } from "@tabler/icons-react";
import { getStoreProducts } from "@/utils/supabase/queries/get-store-products";
import { getActiveMerchants } from "@/utils/supabase/queries/get-merchants";
import { ProductsTable } from "./components/products-table";
import { ProductsHeader } from "./components/products-header";

interface ProductsPageProps {
  searchParams: Promise<{
    q?: string;
    merchant?: string;
    status?: string;
    min?: string;
    max?: string;
  }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const { q, merchant, status, min, max } = await searchParams;

  const minPrice = min ? parseFloat(min) : undefined;
  const maxPrice = max ? parseFloat(max) : undefined;

  const [products, merchants] = await Promise.all([
    getStoreProducts({
      search: q,
      merchantId: merchant,
      status:
        status === "published" || status === "unpublished" ? status : undefined,
      minPrice:
        minPrice !== undefined && !isNaN(minPrice) ? minPrice : undefined,
      maxPrice:
        maxPrice !== undefined && !isNaN(maxPrice) ? maxPrice : undefined,
    }),
    getActiveMerchants(),
  ]);

  return (
    <div className="w-full lg:px-6 py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Title row */}
        <div className="flex items-center gap-4 px-4 lg:px-6">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary-light text-tide">
            <IconBox size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">
              Products in store
            </h1>
            <p className="mt-0.5 text-sm text-text-secondary">
              {products.length} product{products.length !== 1 ? "s" : ""}
              {q ? ` matching "${q}"` : " in your store"}
            </p>
          </div>
        </div>

        {/* Search + filters + Add */}
        <ProductsHeader
          initialSearch={q}
          initialMerchant={merchant}
          initialStatus={status}
          initialMinPrice={min}
          initialMaxPrice={max}
          merchants={merchants}
        />

        {/* Table */}
        <ProductsTable products={products} />
      </div>
    </div>
  );
}
