import { notFound } from "next/navigation";
import { IconTag } from "@tabler/icons-react";
import { getCategoryById } from "@/utils/supabase/queries/get-category-by-id";
import EditCategoryForm from "./edit-category-form";

interface EditCategoryPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function EditCategoryPage({
  params,
}: EditCategoryPageProps) {
  const { id, locale } = await params;
  const category = await getCategoryById(id);

  if (!category) notFound();

  return (
    <div className="w-full px-4 py-6 lg:px-8">
      <div className="mx-auto">
        {/* Page Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-light text-tide">
            <IconTag size={20} aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">
              Edit Category
            </h1>
            <p className="text-sm text-text-secondary">
              Update the details for{" "}
              <span className="font-medium text-text-primary">
                {category.name_en}
              </span>
              .
            </p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <EditCategoryForm category={category} locale={locale} />
        </div>
      </div>
    </div>
  );
}
