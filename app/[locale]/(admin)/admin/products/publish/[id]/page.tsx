import { notFound } from "next/navigation";
import { IconRocket, IconRocketOff } from "@tabler/icons-react";
import { getMerchantProduct } from "@/utils/supabase/queries/get-merchant-product";
import { getCategories } from "@/utils/supabase/queries/get-categories";
import { cn } from "@/lib/utils";
import { PublishProductForm } from "./publish-product-form";

interface PublishProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function PublishProductPage({
  params,
}: PublishProductPageProps) {
  const { id } = await params;

  const [merchantProduct, categories] = await Promise.all([
    getMerchantProduct(id),
    getCategories(),
  ]);

  if (!merchantProduct) notFound();

  const isPublished = merchantProduct.is_published;

  return (
    <div className="w-full px-4 py-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Page Header */}
        <div className="mb-6 flex items-center gap-3">
          <div
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-xl",
              isPublished ? "bg-bloom/10 text-bloom" : "bg-primary-light text-tide",
            )}
          >
            {isPublished ? (
              <IconRocketOff size={20} aria-hidden="true" />
            ) : (
              <IconRocket size={20} aria-hidden="true" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">
              {isPublished ? "Unpublish Product" : "Publish Product"}
            </h1>
            <p className="text-sm text-text-secondary">
              {isPublished
                ? `${merchantProduct.name_en} is currently live on the storefront.`
                : `Review the details and publish ${merchantProduct.name_en} to the storefront.`}
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-tide/30 to-transparent"
          />
          <PublishProductForm
            merchantProduct={merchantProduct}
            categories={categories}
          />
        </div>
      </div>
    </div>
  );
}
