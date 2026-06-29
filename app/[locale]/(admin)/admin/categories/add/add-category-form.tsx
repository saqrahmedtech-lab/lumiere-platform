"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema, type CategoryFormValues } from "@/lib/schemas/category";
import { createCategory } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

export default function AddCategoryForm() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const categoriesHref = `/${locale}/admin/categories`;

  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, touchedFields, isSubmitted },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name_en: "", name_ar: "", slug: "" },
  });

  const showError = (field: keyof CategoryFormValues) =>
    touchedFields[field] || isSubmitted ? errors[field]?.message : undefined;

  async function onSubmit(values: CategoryFormValues) {
    setIsSubmitting(true);
    setServerError(null);

    const formData = new FormData();
    formData.set("name_en", values.name_en);
    formData.set("name_ar", values.name_ar);
    formData.set("slug", values.slug);

    const result = await createCategory(formData);

    if (result?.error) {
      const err = result.error;
      if ("slug" in err && err.slug) setError("slug", { message: err.slug[0] });
      if ("_form" in err && err._form) setServerError(err._form[0]);
      setIsSubmitting(false);
    }
  }

  const inputClass =
    "h-11 rounded-xl border-border bg-pearl text-text-primary placeholder:text-text-tertiary focus-visible:border-tide focus-visible:ring-2 focus-visible:ring-tide/20";

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Section header */}
      <div className="mb-5">
        <h2 className="text-sm font-semibold text-text-primary">Category details</h2>
        <p className="mt-0.5 text-sm text-text-secondary">
          Add the display names and URL slug for this category.
        </p>
      </div>

      {/* Name (English) + Name (Arabic) */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="name_en" className="text-sm font-medium text-text-primary">
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
            <p className="text-xs font-medium text-bloom">{showError("name_en")}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="name_ar" className="text-sm font-medium text-text-primary">
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
            <p className="text-xs font-medium text-bloom">{showError("name_ar")}</p>
          )}
        </div>
      </div>

      {/* Slug */}
      <div className="mt-4 space-y-1">
        <Label htmlFor="slug" className="text-sm font-medium text-text-primary">
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
          <p className="text-xs font-medium text-bloom">{showError("slug")}</p>
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
        <Button type="button" variant="outline" disabled={isSubmitting} asChild>
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
              Adding...
            </span>
          ) : (
            "Add Category"
          )}
        </Button>
      </div>
    </form>
  );
}
