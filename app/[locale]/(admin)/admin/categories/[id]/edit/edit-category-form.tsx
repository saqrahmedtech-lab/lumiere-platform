"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconLayoutGrid, IconTag, IconWorld } from "@tabler/icons-react";
import {
  categorySchema,
  type CategoryFormValues,
} from "@/lib/schemas/category";
import { updateCategory } from "../../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Category {
  id: string;
  name_en: string;
  name_ar: string;
  slug: string;
  created_at: string;
  parent_id: string | null;
  display_order: number;
}

interface EditCategoryFormProps {
  category: Category;
  locale: string;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function RequiredMark() {
  return (
    <span className="ms-0.5 text-bloom" aria-hidden="true">
      *
    </span>
  );
}

const inputClass =
  "h-11 rounded-xl border-border bg-pearl text-text-primary placeholder:text-text-tertiary focus-visible:border-tide focus-visible:ring-2 focus-visible:ring-tide/20";

export default function EditCategoryForm({
  category,
  locale,
}: EditCategoryFormProps) {
  const categoriesHref = `/${locale}/admin/categories`;

  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    control,
    formState: { errors, touchedFields, isSubmitted },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name_en: category.name_en,
      name_ar: category.name_ar,
      slug: category.slug,
    },
  });

  const watchedNameEn = useWatch({ control, name: "name_en" });
  const watchedSlug = useWatch({ control, name: "slug" });

  const showError = (field: keyof CategoryFormValues) =>
    touchedFields[field] || isSubmitted ? errors[field]?.message : undefined;

  async function onSubmit(values: CategoryFormValues) {
    setIsSubmitting(true);
    setServerError(null);

    const formData = new FormData();
    formData.set("name_en", values.name_en);
    formData.set("name_ar", values.name_ar);
    formData.set("slug", values.slug);

    const result = await updateCategory(category.id, formData);

    if (result?.error) {
      const err = result.error;
      if ("slug" in err && err.slug) setError("slug", { message: err.slug[0] });
      if ("_form" in err && err._form) setServerError(err._form[0]);
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_260px]">
      {/* ── Form ── */}
      <div className="lg:pe-8">
        <div className="mb-5">
          <h2 className="text-sm font-semibold text-text-primary">
            Category details
          </h2>
          <p className="mt-0.5 text-sm text-text-secondary">
            Update the display names and URL slug for this category.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name (English) + Name (Arabic) */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <Label
                htmlFor="name_en"
                className="text-sm font-medium text-text-primary"
              >
                Name (English) <RequiredMark />
              </Label>
              <Input
                id="name_en"
                placeholder="e.g. Skincare"
                className={inputClass}
                {...register("name_en", {
                  onChange: (e) => {
                    if (!slugTouched) {
                      setValue("slug", slugify(e.target.value), {
                        shouldValidate: isSubmitted,
                      });
                    }
                  },
                })}
              />
              <p className="text-xs text-text-secondary/70">
                This name will be shown in the storefront.
              </p>
              {showError("name_en") && (
                <p className="text-xs font-medium text-bloom">
                  {showError("name_en")}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="name_ar"
                className="text-sm font-medium text-text-primary"
              >
                Name (Arabic) <RequiredMark />
              </Label>
              <Input
                id="name_ar"
                dir="rtl"
                placeholder="مثال: العناية بالبشرة"
                className={inputClass}
                {...register("name_ar")}
              />
              <p className="text-xs text-text-secondary/70">
                This name will be shown in Arabic.
              </p>
              {showError("name_ar") && (
                <p className="text-xs font-medium text-bloom">
                  {showError("name_ar")}
                </p>
              )}
            </div>
          </div>

          {/* Slug */}
          <div className="mt-4 space-y-1">
            <Label
              htmlFor="slug"
              className="text-sm font-medium text-text-primary"
            >
              Slug <RequiredMark />
            </Label>
            <Input
              id="slug"
              placeholder="e.g. skincare"
              className={`${inputClass} font-mono text-sm`}
              {...register("slug", { onChange: () => setSlugTouched(true) })}
            />
            <p className="text-xs text-text-secondary/70">
              Auto-generated from the English name. You can edit it if needed.
            </p>
            {showError("slug") && (
              <p className="text-xs font-medium text-bloom">
                {showError("slug")}
              </p>
            )}
          </div>

          {/* Server error */}
          {serverError && (
            <p className="mt-4 rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
              {serverError}
            </p>
          )}

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-3 border-t border-border pt-5">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              asChild
            >
              <Link href={categoriesHref}>Cancel</Link>
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-32 bg-tide text-pearl hover:bg-tide/90"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="size-4 rounded-full border-2 border-pearl/40 border-t-pearl animate-spin" />
                  Saving...
                </span>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* ── Preview ── */}
      <aside className="mt-6 border-t border-border pt-6 lg:mt-0 lg:border-s lg:border-t-0 lg:ps-8 lg:pt-0">
        <p className="text-sm font-semibold text-text-primary">Preview</p>
        <p className="mt-0.5 text-xs text-text-secondary">
          How this category may appear in your storefront.
        </p>

        <div className="mt-4 rounded-xl border border-border bg-pearl/80 p-4 shadow-sm space-y-4">
          {/* Icon + name */}
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-tide/10 text-tide">
              <IconTag size={18} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-text-primary">
                {watchedNameEn || category.name_en}
              </p>
              <p className="truncate text-xs text-tide">
                /shop/{watchedSlug || category.slug}
              </p>
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* URL Slug */}
          <div className="flex items-start gap-2.5">
            <IconWorld
              size={15}
              className="mt-0.5 shrink-0 text-text-tertiary"
              aria-hidden="true"
            />
            <div>
              <p className="text-xs font-medium text-text-secondary">
                URL Slug
              </p>
              <p className="mt-0.5 font-mono text-xs text-text-tertiary">
                /shop/{watchedSlug || category.slug}
              </p>
            </div>
          </div>

          {/* Products */}
          <div className="flex items-start gap-2.5">
            <IconLayoutGrid
              size={15}
              className="mt-0.5 shrink-0 text-text-tertiary"
              aria-hidden="true"
            />
            <div>
              <p className="text-xs font-medium text-text-secondary">
                Products
              </p>
              <p className="mt-0.5 text-xs text-text-tertiary">0 products</p>
            </div>
          </div>

          {/* Created */}
          <div className="h-px bg-border" />
          <p className="text-xs text-text-tertiary">
            Created{" "}
            {new Date(category.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
      </aside>
    </div>
  );
}
