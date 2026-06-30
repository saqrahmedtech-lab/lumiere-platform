"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconBuilding, IconPencil } from "@tabler/icons-react";
import {
  productSchema,
  computeFinalPrice,
  type ProductFormValues,
} from "@/lib/schemas/product";
import type { MerchantProductOption } from "@/utils/supabase/queries/get-merchant-products";
import { createProduct } from "../actions";
import { MerchantProductPicker } from "../components/merchant-product-picker";
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

interface Category {
  id: string;
  name_en: string;
  name_ar: string;
}

interface AddProductFormProps {
  categories: Category[];
  merchantProducts: MerchantProductOption[];
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

export default function AddProductForm({
  categories,
  merchantProducts,
}: AddProductFormProps) {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const productsHref = `/${locale}/admin/products`;

  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log({ merchantProducts });

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    control,
    formState: { errors, touchedFields, isSubmitted },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      source: "merchant",
      merchant_product_id: null,
      merchant_id: null,
      category_id: "",
      name_en: "",
      name_ar: "",
      description_en: "",
      description_ar: "",
      base_price: 0,
      margin_percent: 0,
    },
  });

  const source = useWatch({ control, name: "source" });
  const merchantProductId = useWatch({ control, name: "merchant_product_id" });
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

  function handleSourceChange(next: "merchant" | "manual") {
    setValue("source", next);
    setValue("merchant_product_id", null);
    if (next === "merchant") {
      setValue("merchant_id", null);
    }
  }

  function handlePickerSelect(product: MerchantProductOption) {
    setValue("merchant_product_id", product.id, {
      shouldValidate: isSubmitted,
    });
    setValue("name_en", product.name_en, { shouldDirty: true });
    if (product.name_ar)
      setValue("name_ar", product.name_ar, { shouldDirty: true });
    if (product.description_en)
      setValue("description_en", product.description_en, { shouldDirty: true });
    if (product.description_ar)
      setValue("description_ar", product.description_ar, { shouldDirty: true });
    setValue("base_price", product.base_price, { shouldDirty: true });
  }

  async function onSubmit(values: ProductFormValues) {
    setIsSubmitting(true);
    setServerError(null);

    const formData = new FormData();
    formData.set("source", values.source);
    if (values.merchant_product_id)
      formData.set("merchant_product_id", values.merchant_product_id);
    if (values.merchant_id) formData.set("merchant_id", values.merchant_id);
    formData.set("category_id", values.category_id);
    formData.set("name_en", values.name_en);
    formData.set("name_ar", values.name_ar);
    formData.set("description_en", values.description_en ?? "");
    formData.set("description_ar", values.description_ar ?? "");
    formData.set("base_price", String(values.base_price));
    formData.set("margin_percent", String(values.margin_percent));

    try {
      const result = await createProduct(formData);

      if (result?.error) {
        const err = result.error;
        if ("merchant_product_id" in err && err.merchant_product_id?.[0]) {
          setError("merchant_product_id", {
            message: err.merchant_product_id[0],
          });
        }
        if ("_form" in err && err._form?.[0]) {
          setServerError(err._form[0]);
        }
        setIsSubmitting(false);
      }
    } catch {
      setServerError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* ── Source toggle ── */}
      <SectionHeading
        title="Product source"
        description="Choose where this product originates."
      />

      <div className="mb-8 flex gap-2">
        <button
          type="button"
          onClick={() => handleSourceChange("merchant")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors",
            source === "merchant"
              ? "border-tide bg-tide/10 text-tide"
              : "border-border bg-pearl text-text-secondary hover:border-tide/40 hover:text-text-primary",
          )}
        >
          <IconBuilding size={16} aria-hidden="true" />
          From Merchant
        </button>

        <button
          type="button"
          onClick={() => handleSourceChange("manual")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors",
            source === "manual"
              ? "border-tide bg-tide/10 text-tide"
              : "border-border bg-pearl text-text-secondary hover:border-tide/40 hover:text-text-primary",
          )}
        >
          <IconPencil size={16} aria-hidden="true" />
          Manual
        </button>
      </div>

      {/* ── Merchant Picker ── */}
      {source === "merchant" && (
        <div className="mb-8">
          <div className="mb-4 border-t border-border pt-6">
            <h2 className="text-base font-semibold text-text-primary">
              Merchant product <RequiredMark />
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              Select an approved product from the merchant catalog.
            </p>
          </div>

          <MerchantProductPicker
            products={merchantProducts}
            selectedId={merchantProductId ?? null}
            onSelect={handlePickerSelect}
          />

          {showError("merchant_product_id") && (
            <p className="mt-2 text-xs font-medium text-bloom">
              {showError("merchant_product_id")}
            </p>
          )}
        </div>
      )}

      {/* ── Category ── */}
      <div className="border-t border-border pt-6">
        <SectionHeading
          title="Category & details"
          description="Fill in the product information that will appear on the storefront."
        />
      </div>

      <div className="mb-5 space-y-1.5">
        <Label className="text-sm font-medium text-text-primary">
          Category <RequiredMark />
        </Label>

        <Controller
          name="category_id"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
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

        <Button
          type="submit"
          disabled={isSubmitting}
          className="min-w-32 bg-tide text-pearl hover:bg-tide/90"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="size-4 animate-spin rounded-full border-2 border-pearl/40 border-t-pearl" />
              Adding...
            </span>
          ) : (
            "Add Product"
          )}
        </Button>
      </div>
    </form>
  );
}
