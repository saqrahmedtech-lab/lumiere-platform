import { IconBulb, IconTag } from "@tabler/icons-react";
import AddCategoryForm from "./add-category-form";

export default function NewCategoryPage() {
  return (
    <div className="w-full px-4 py-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Page Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-light text-tide">
            <IconTag size={20} aria-hidden="true" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">
              Add Category
            </h1>
            <p className="text-sm text-text-secondary">
              Create a new product category for your storefront.
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

            <AddCategoryForm />
          </div>

          {/* Side Panel */}
          <aside className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm xl:sticky xl:top-6 xl:self-start">
            <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-primary-light text-tide">
              <IconBulb size={18} aria-hidden="true" />
            </div>

            <h2 className="text-sm font-semibold text-text-primary">
              Category tips
            </h2>

            <p className="mt-1 text-sm leading-relaxed text-text-secondary">
              Categories help shoppers browse your store faster. Use clear names
              like Skincare, Makeup, Sun care, or Body care.
            </p>

            <div className="mt-5 space-y-4 border-t border-border pt-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
                  English name
                </p>
                <p className="mt-1 text-sm text-text-secondary">
                  Used in the English storefront and admin tables.
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
                  Arabic name
                </p>
                <p className="mt-1 text-sm text-text-secondary">
                  Used when the storefront language is Arabic.
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
                  Slug
                </p>
                <p className="mt-1 text-sm text-text-secondary">
                  Used in the category URL, for example{" "}
                  <span className="font-mono text-tide">/shop/skincare</span>.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
