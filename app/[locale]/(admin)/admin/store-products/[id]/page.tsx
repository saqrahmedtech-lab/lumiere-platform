import { notFound } from "next/navigation";
import { IconPackage } from "@tabler/icons-react";
import { getProductById } from "@/utils/supabase/queries/get-product-by-id";
import { getCategories } from "@/utils/supabase/queries/get-categories";
import { getActiveMerchants } from "@/utils/supabase/queries/get-merchants";
import AddProductForm from "../add/add-product-form";

interface EditProductPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;

  const product = await getProductById(id);
  if (!product) notFound();

  const [categories, merchants] = await Promise.all([
    getCategories(),
    product.source === "manual" ? getActiveMerchants() : Promise.resolve([]),
  ]);

  return (
    <div className="w-full px-4 py-6 lg:px-8">
      <div className="mx-auto">
        {/* Page Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-light text-tide">
            <IconPackage size={20} aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">
              Edit Product
            </h1>
            <p className="text-sm text-text-secondary">
              Updating{" "}
              <span className="font-medium text-text-primary">
                {product.name_en}
              </span>
              .
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-tide/30 to-transparent"
          />
          <AddProductForm
            product={product}
            categories={categories}
            merchants={merchants}
          />
        </div>
      </div>
    </div>
  );
}
