import { PackageSearch } from "lucide-react";
import { getMerchantProducts } from "@/utils/supabase/queries/get-all-merchant-products";
import { getActiveMerchants } from "@/utils/supabase/queries/get-merchants";
import { ProductsTable } from "./components/products-table";
import { ProductsHeader } from "./components/products-header";

interface ProductsPageProps {
  searchParams: Promise<{
    q?: string;
    status?: string;
    merchant?: string;
  }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const { q, status, merchant } = await searchParams;

  const [products, merchants] = await Promise.all([
    getMerchantProducts({
      search: q,
      isPublished:
        status === "published"
          ? true
          : status === "unpublished"
            ? false
            : undefined,
      merchantId: merchant,
    }),
    getActiveMerchants(),
  ]);

  return (
    <div className="w-full lg:px-6 py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Title row */}
        <div className="flex items-center gap-4 px-4 lg:px-6">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary-light text-tide">
            <PackageSearch size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">
              All products
            </h1>
            <p className="mt-0.5 text-sm text-text-secondary">
              {products.length} product{products.length !== 1 ? "s" : ""}
              {q ? ` matching "${q}"` : " from merchants"}
            </p>
          </div>
        </div>

        {/* Search + filters */}
        <ProductsHeader
          initialSearch={q}
          initialStatus={status}
          initialMerchant={merchant}
          merchants={merchants}
        />

        {/* Table */}
        <ProductsTable products={products} />
      </div>
    </div>
  );
}
