import { z } from "zod";

export const productSchema = z
  .object({
    source: z.enum(["manual", "merchant"]),
    merchant_product_id: z.string().uuid().optional().nullable(),
    merchant_id: z.string().uuid().optional().nullable(),
    category_id: z.string().uuid({ message: "Select a category" }),
    name_en: z.string().min(2, "English name must be at least 2 characters"),
    name_ar: z.string().min(2, "Arabic name must be at least 2 characters"),
    description_en: z.string().optional(),
    description_ar: z.string().optional(),
    base_price: z.coerce.number().positive("Base price must be greater than 0"),
    margin_percent: z.coerce.number().min(0, "Margin cannot be negative"),
  })
  .refine(
    (data) => data.source !== "merchant" || Boolean(data.merchant_product_id),
    { message: "Select a merchant product", path: ["merchant_product_id"] },
  );

export type ProductFormValues = z.infer<typeof productSchema>;

export function computeFinalPrice(basePrice: number, marginPercent: number) {
  return Math.round(basePrice * (1 + marginPercent / 100) * 100) / 100;
}
