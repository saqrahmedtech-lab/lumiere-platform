"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, useWatch, Controller, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconInfoCircle,
  IconLayoutGrid,
  IconTag,
  IconWorld,
} from "@tabler/icons-react";

import {
  categorySchema,
  type CategoryFormValues,
} from "@/lib/schemas/category";

import { updateCategory } from "../actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  ProductImagePicker,
  type ProductImage,
} from "@/components/ui/product-image-picker";
import { isRedirectError } from "next/dist/client/components/redirect-error";

interface Category {
  id: string;
  name_en: string;
  name_ar: string;
  slug: string;
  created_at: string;
  parent_id: string | null;
  display_order: number;
  image: string | null;
  is_published: boolean;
  description_en: string | null;
  description_ar: string | null;
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

const textareaClass =
  "min-h-[80px] w-full resize-none rounded-xl border border-border bg-pearl px-3 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none focus:border-tide focus:ring-2 focus:ring-tide/20";

export default function EditCategoryForm({
  category,
  locale,
}: EditCategoryFormProps) {
  const categoriesHref = `/${locale}/admin/categories`;

  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [categoryImage, setCategoryImage] = useState<ProductImage[]>(() =>
    category.image
      ? [
          {
            id: crypto.randomUUID(),
            previewUrl: category.image,
            url: category.image,
            status: "done" as const,
          },
        ]
      : [],
  );

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    control,
    formState: { errors, touchedFields, isSubmitted },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema) as Resolver<CategoryFormValues>,
    defaultValues: {
      name_en: category.name_en,
      name_ar: category.name_ar,
      slug: category.slug,
      image: category.image,
      is_published: category.is_published,
      description_en: category.description_en ?? "",
      description_ar: category.description_ar ?? "",
    },
  });

  const watchedNameEn = useWatch({ control, name: "name_en" });
  const watchedSlug = useWatch({ control, name: "slug" });

  const showError = (field: keyof CategoryFormValues) => {
    if (!touchedFields[field] && !isSubmitted) return undefined;
    return errors[field]?.message;
  };

  async function onSubmit(values: CategoryFormValues) {
    setIsSubmitting(true);
    setServerError(null);

    const formData = new FormData();
    formData.set("name_en", values.name_en);
    formData.set("name_ar", values.name_ar);
    formData.set("slug", values.slug);
    formData.set("is_published", String(values.is_published));
    formData.set("description_en", values.description_en ?? "");
    formData.set("description_ar", values.description_ar ?? "");

    const imageUrl = categoryImage[0]?.url;
    if (imageUrl) formData.set("image", imageUrl);

    try {
      const result = await updateCategory(category.id, formData);

      if (result?.error) {
        const err = result.error;

        if ("slug" in err && err.slug?.[0]) {
          setError("slug", { message: err.slug[0] });
        }

        if ("_form" in err && err._form?.[0]) {
          setServerError(err._form[0]);
        }

        setIsSubmitting(false);
      }
    } catch (err) {
      if (isRedirectError(err)) throw err;
      setServerError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {/* Form Card */}
      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-tide/30 to-transparent"
        />

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <h2 className="text-base font-semibold text-text-primary">
              Category details
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              Update the display names and URL slug for this category.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-1.5">
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
                        shouldDirty: true,
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

            <div className="space-y-1.5">
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

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label
                htmlFor="description_en"
                className="text-sm font-medium text-text-primary"
              >
                Description (English)
              </Label>

              <textarea
                id="description_en"
                placeholder="Short category description..."
                className={textareaClass}
                {...register("description_en")}
              />

              {showError("description_en") && (
                <p className="text-xs font-medium text-bloom">
                  {showError("description_en")}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="description_ar"
                className="text-sm font-medium text-text-primary"
              >
                Description (Arabic)
              </Label>

              <textarea
                id="description_ar"
                dir="rtl"
                placeholder="وصف مختصر للفئة..."
                className={textareaClass}
                {...register("description_ar")}
              />

              {showError("description_ar") && (
                <p className="text-xs font-medium text-bloom">
                  {showError("description_ar")}
                </p>
              )}
            </div>
          </div>

          <div className="mt-5 space-y-1.5">
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
              {...register("slug", {
                onChange: () => setSlugTouched(true),
              })}
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

          <div className="mt-6 border-t border-border pt-6">
            <h2 className="text-base font-semibold text-text-primary">Image</h2>
            <p className="mt-1 mb-3 text-sm text-text-secondary">
              Upload a cover image for this category.
            </p>
            <ProductImagePicker
              images={categoryImage}
              onChange={setCategoryImage}
              maxImages={1}
            />
          </div>

          <div className="mt-6 flex items-center justify-between rounded-xl border border-border bg-pearl/60 px-4 py-3">
            <div>
              <Label
                htmlFor="is_published"
                className="text-sm font-medium text-text-primary"
              >
                Visible on storefront
              </Label>
              <p className="mt-0.5 text-xs text-text-secondary">
                Unpublished categories are hidden from customers.
              </p>
            </div>

            <Controller
              name="is_published"
              control={control}
              render={({ field }) => (
                <Switch
                  id="is_published"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-tide"
                />
              )}
            />
          </div>

          {serverError && (
            <p className="mt-5 rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
              {serverError}
            </p>
          )}

          <div className="mt-7 flex items-center justify-end gap-3 border-t border-border pt-5">
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
                  <span className="size-4 animate-spin rounded-full border-2 border-pearl/40 border-t-pearl" />
                  Saving...
                </span>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Preview / Info Panel */}
      <aside className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm xl:sticky xl:top-6 xl:self-start">
        <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-primary-light text-tide">
          <IconTag size={18} aria-hidden="true" />
        </div>

        <h2 className="text-sm font-semibold text-text-primary">
          Category preview
        </h2>

        <p className="mt-1 text-sm leading-relaxed text-text-secondary">
          This is how the category may appear in your storefront.
        </p>

        <div className="mt-5 rounded-xl border border-border bg-pearl/80 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-tide/10 text-tide">
              <IconTag size={18} aria-hidden="true" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-text-primary">
                {watchedNameEn || category.name_en}
              </p>

              <p className="truncate text-xs font-medium text-tide">
                /shop/{watchedSlug || category.slug}
              </p>
            </div>
          </div>

          <div className="my-4 h-px bg-border" />

          <div className="grid gap-3">
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
          </div>
        </div>

        <div className="mt-5 space-y-4 border-t border-border pt-4">
          <div className="flex gap-3">
            <IconInfoCircle
              size={17}
              className="mt-0.5 shrink-0 text-tide"
              aria-hidden="true"
            />

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
                Created
              </p>

              <p className="mt-1 text-sm text-text-secondary">
                {new Date(category.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
