import { IconBulb, IconPackage } from "@tabler/icons-react";
import { getCategories } from "@/utils/supabase/queries/get-categories";
import { getMerchantProductsForPicker } from "@/utils/supabase/queries/get-merchant-products";
import AddProductForm from "./add-product-form";

export default async function AddProductPage() {
  const [categories, merchantProducts] = await Promise.all([
    getCategories(),
    getMerchantProductsForPicker(),
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
              Add Product
            </h1>
            <p className="text-sm text-text-secondary">
              Publish a new product to your storefront.
            </p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          {/* Form Card */}
          <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-tide/30 to-transparent"
            />
            <AddProductForm
              categories={categories}
              merchantProducts={merchantProducts}
            />
          </div>

          {/* Tips sidebar */}
          <aside className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm xl:sticky xl:top-6 xl:self-start">
            <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-primary-light text-tide">
              <IconBulb size={18} aria-hidden="true" />
            </div>

            <h2 className="text-sm font-semibold text-text-primary">
              Product tips
            </h2>

            <p className="mt-1 text-sm leading-relaxed text-text-secondary">
              Products can come from a merchant catalog or be entered manually.
              Both appear the same way on the storefront.
            </p>

            <div className="mt-5 space-y-4 border-t border-border pt-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
                  From merchant
                </p>
                <p className="mt-1 text-sm text-text-secondary">
                  Pick an approved merchant product. Name and base price are
                  pre-filled; you control the margin.
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
                  Manual
                </p>
                <p className="mt-1 text-sm text-text-secondary">
                  Fill in all details yourself. Use this for in-house or
                  exclusive products.
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
                  Final price
                </p>
                <p className="mt-1 text-sm text-text-secondary">
                  Calculated as{" "}
                  <span className="font-mono text-tide">
                    base × (1 + margin%)
                  </span>
                  . This is what customers see.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
