"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useForm, useWatch, Controller, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { IconAlertTriangle, IconBuilding } from "@tabler/icons-react";
import {
  productSchema,
  computeFinalPrice,
  type ProductFormValues,
} from "@/lib/schemas/product";
import type { MerchantProductDetail } from "@/utils/supabase/queries/get-merchant-product";
import { publishMerchantProduct, unpublishMerchantProduct } from "../../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  ProductImagePicker,
  type ProductImage,
} from "@/components/ui/product-image-picker";

interface Category {
  id: string;
  name_en: string;
  name_ar: string;
}

interface PublishProductFormProps {
  merchantProduct: MerchantProductDetail;
  categories: Category[];
}

function RequiredMark() {
  return (
    <span className="ms-0.5 text-bloom" aria-hidden="true">
      *
    </span>
  );
}

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-5">
      <h2 className="text-base font-semibold text-text-primary">{title}</h2>
      {description && (
        <p className="mt-1 text-sm text-text-secondary">{description}</p>
      )}
    </div>
  );
}

const inputClass =
  "h-11 rounded-xl border-border bg-pearl text-text-primary placeholder:text-text-tertiary focus-visible:border-tide focus-visible:ring-2 focus-visible:ring-tide/20";

const textareaClass =
  "min-h-[80px] w-full resize-none rounded-xl border border-border bg-pearl px-3 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none focus:border-tide focus:ring-2 focus:ring-tide/20";

export function PublishProductForm({
  merchantProduct,
  categories,
}: PublishProductFormProps) {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const productsHref = `/${locale}/admin/products`;
  const isPublished = merchantProduct.is_published;

  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [productImages, setProductImages] = useState<ProductImage[]>(() =>
    (merchantProduct.images ?? []).map((url) => ({
      id: crypto.randomUUID(),
      previewUrl: url,
      url,
      status: "done" as const,
    })),
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, touchedFields, isSubmitted },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as Resolver<ProductFormValues>,
    defaultValues: {
      source: "merchant",
      merchant_product_id: merchantProduct.id,
      merchant_id: merchantProduct.merchant_id,
      category_id: "",
      name_en: merchantProduct.name_en,
      name_ar: merchantProduct.name_ar ?? "",
      description_en: merchantProduct.description_en ?? "",
      description_ar: merchantProduct.description_ar ?? "",
      base_price: merchantProduct.base_price,
      margin_percent: 0,
    },
  });

  const basePrice = useWatch({ control, name: "base_price" });
  const marginPercent = useWatch({ control, name: "margin_percent" });

  const finalPrice =
    basePrice > 0
      ? computeFinalPrice(Number(basePrice), Number(marginPercent))
      : null;

  const showError = (field: keyof ProductFormValues) => {
    if (!touchedFields[field] && !isSubmitted) return undefined;
    return errors[field]?.message;
  };

  async function onSubmit(values: ProductFormValues) {
    // Block submission while any image is still uploading or failed
    const hasUploading = productImages.some(
      (img) => img.status === "uploading",
    );
    const hasError = productImages.some((img) => img.status === "error");
    if (hasUploading) {
      setServerError("Please wait for all images to finish uploading.");
      return;
    }
    if (hasError) {
      setServerError(
        "Remove or retry the failed image upload before submitting.",
      );
      return;
    }

    setIsSubmitting(true);
    setServerError(null);

    try {
      const result = await publishMerchantProduct({
        merchant_product_id: merchantProduct.id,
        category_id: values.category_id,
        name_en: values.name_en,
        name_ar: values.name_ar,
        description_en: values.description_en || null,
        description_ar: values.description_ar || null,
        base_price: Number(values.base_price),
        margin_percent: Number(values.margin_percent),
        images: productImages.filter((img) => img.url).map((img) => img.url!),
      });

      if (result?.error) {
        setServerError(result.error);
        setIsSubmitting(false);
      }
    } catch (err) {
      if (isRedirectError(err)) throw err;
      setServerError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  }

  async function handleUnpublish() {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const result = await unpublishMerchantProduct(merchantProduct.id);

      if (result?.error) {
        setServerError(result.error);
        setIsSubmitting(false);
      }
    } catch (err) {
      if (isRedirectError(err)) throw err;
      setServerError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* ── Unpublishing flag ── */}
      {isPublished && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-bloom/30 bg-bloom/10 px-4 py-3">
          <IconAlertTriangle
            size={18}
            className="mt-0.5 shrink-0 text-bloom"
            aria-hidden="true"
          />
          <div>
            <p className="text-sm font-semibold text-bloom">
              You are about to unpublish this product
            </p>
            <p className="mt-1 text-sm text-bloom/90">
              It will be removed from the storefront immediately and
              customers will no longer be able to purchase it.
            </p>
          </div>
        </div>
      )}

      {/* ── Merchant source banner ── */}
      <div className="mb-6 border-b border-border pb-6">
        <p className="mb-2 text-sm font-medium text-text-secondary">
          Sourced from merchant
        </p>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-sand/30 px-4 py-3">
          <IconBuilding
            size={16}
            className="shrink-0 text-text-tertiary"
            aria-hidden="true"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-text-primary">
              {merchantProduct.name_en}
            </p>
            <p className="text-xs text-text-secondary">
              {merchantProduct.merchants?.business_name} ·{" "}
              {merchantProduct.base_price} EGP base price
            </p>
          </div>
        </div>
      </div>

      {/* ── Category & details ── */}
      <SectionHeading
        title="Category & details"
        description="Fill in the product information that will appear on the storefront."
      />

      <div className="mb-5 space-y-1.5">
        <Label className="text-sm font-medium text-text-primary">
          Category <RequiredMark />
        </Label>

        <Controller
          name="category_id"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={isPublished}
            >
              <SelectTrigger
                className={cn(
                  inputClass,
                  "w-full",
                  showError("category_id") &&
                    "border-bloom focus-visible:ring-bloom/20",
                )}
              >
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name_en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        {showError("category_id") && (
          <p className="text-xs font-medium text-bloom">
            {showError("category_id")}
          </p>
        )}
      </div>

      {/* ── Names ── */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label
            htmlFor="name_en"
            className="text-sm font-medium text-text-primary"
          >
            Name (English) <RequiredMark />
          </Label>
          <Input
            id="name_en"
            placeholder="e.g. Rose Face Serum"
            className={inputClass}
            {...register("name_en")}
            disabled={isPublished}
          />
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
            placeholder="مثال: سيروم الورد للوجه"
            className={inputClass}
            {...register("name_ar")}
            disabled={isPublished}
          />
          {showError("name_ar") && (
            <p className="text-xs font-medium text-bloom">
              {showError("name_ar")}
            </p>
          )}
        </div>
      </div>

      {/* ── Descriptions ── */}
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
            placeholder="Short product description..."
            className={textareaClass}
            {...register("description_en")}
            disabled={isPublished}
          />
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
            placeholder="وصف مختصر للمنتج..."
            className={textareaClass}
            {...register("description_ar")}
            disabled={isPublished}
          />
        </div>
      </div>

      {/* ── Images ── */}
      <div className="mt-6 border-t border-border pt-6">
        <SectionHeading
          title="Images"
          description="Upload up to 6 images. The first image is shown as the cover in listings."
        />
        <div className={cn(isPublished && "pointer-events-none opacity-60")}>
          <ProductImagePicker
            images={productImages}
            onChange={setProductImages}
          />
        </div>
      </div>

      {/* ── Pricing ── */}
      <div className="mt-6 border-t border-border pt-6">
        <SectionHeading
          title="Pricing"
          description="Set the base price and your margin. The final price is calculated automatically."
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label
            htmlFor="base_price"
            className="text-sm font-medium text-text-primary"
          >
            Base price (EGP) <RequiredMark />
          </Label>
          <Input
            id="base_price"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            className={inputClass}
            {...register("base_price", { valueAsNumber: true })}
            disabled={isPublished}
          />
          {showError("base_price") && (
            <p className="text-xs font-medium text-bloom">
              {showError("base_price")}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="margin_percent"
            className="text-sm font-medium text-text-primary"
          >
            Margin (%)
          </Label>
          <Input
            id="margin_percent"
            type="number"
            min="0"
            step="0.1"
            placeholder="0"
            className={inputClass}
            {...register("margin_percent", { valueAsNumber: true })}
            disabled={isPublished}
          />
          {showError("margin_percent") && (
            <p className="text-xs font-medium text-bloom">
              {showError("margin_percent")}
            </p>
          )}
        </div>
      </div>

      {/* ── Price preview ── */}
      {finalPrice !== null && (
        <div className="mt-4 flex items-center justify-between rounded-xl border border-tide/20 bg-tide/5 px-4 py-3">
          <div className="flex items-center gap-4 text-sm text-text-secondary">
            <span>
              Base:{" "}
              <span className="font-medium text-text-primary">
                {Number(basePrice).toFixed(2)} EGP
              </span>
            </span>
            <span className="text-border">·</span>
            <span>
              Margin:{" "}
              <span className="font-medium text-text-primary">
                {Number(marginPercent)}%
              </span>
            </span>
          </div>
          <div className="text-right">
            <p className="text-xs text-text-secondary">Final price</p>
            <p className="text-lg font-bold text-tide">
              {finalPrice.toFixed(2)} EGP
            </p>
          </div>
        </div>
      )}

      {/* ── Server error ── */}
      {serverError && (
        <p className="mt-5 rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          {serverError}
        </p>
      )}

      {/* ── Actions ── */}
      <div className="mt-7 flex items-center justify-end gap-3 border-t border-border pt-5">
        <Button type="button" variant="outline" disabled={isSubmitting} asChild>
          <Link href={productsHref}>Cancel</Link>
        </Button>

        {isPublished ? (
          <Button
            type="button"
            onClick={handleUnpublish}
            disabled={isSubmitting}
            className="min-w-36 bg-bloom text-pearl hover:bg-bloom-dark"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="size-4 animate-spin rounded-full border-2 border-pearl/40 border-t-pearl" />
                Unpublishing...
              </span>
            ) : (
              "Unpublish Product"
            )}
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-36 bg-tide text-pearl hover:bg-tide/90"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="size-4 animate-spin rounded-full border-2 border-pearl/40 border-t-pearl" />
                Publishing...
              </span>
            ) : (
              "Publish Product"
            )}
          </Button>
        )}
      </div>
    </form>
  );
}
