import { IconTag } from "@tabler/icons-react";
import AddCategoryForm from "./add-category-form";

export default function NewCategoryPage() {
  return (
    <div className="w-full px-4 py-6 lg:px-6">
      <div className="mx-auto max-w-4xl">
        {/* Page Header */}
        <div className="mb-5 flex items-center gap-3">
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

        {/* Form Card */}
        <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
          <AddCategoryForm />
        </div>
      </div>
    </div>
  );
}
