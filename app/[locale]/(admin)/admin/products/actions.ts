"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type PublishProductPayload = {
  merchant_product_id: string;
  category_id: string;
  name_en: string;
  name_ar: string;
  description_en?: string | null;
  description_ar?: string | null;
  base_price: number;
  margin_percent: number;
  images?: string[];
};

export async function publishMerchantProduct(payload: PublishProductPayload) {
  const supabase = await createClient();

  // Compute final price via the existing Postgres function
  const { data: finalPrice, error: rpcError } = await supabase.rpc(
    "compute_final_price",
    {
      base_price: payload.base_price,
      margin_percent: payload.margin_percent,
    },
  );

  if (rpcError) {
    return { error: rpcError.message };
  }

  // Insert into store_products with is_published: true
  // The trigger automatically sets merchant_products.is_published = true
  const { error: insertError } = await supabase.from("store_products").insert({
    source: "merchant",
    merchant_product_id: payload.merchant_product_id,
    category_id: payload.category_id,
    name_en: payload.name_en,
    name_ar: payload.name_ar,
    description_en: payload.description_en ?? null,
    description_ar: payload.description_ar ?? null,
    base_price: payload.base_price,
    margin_percent: payload.margin_percent,
    final_price: finalPrice,
    images: payload.images ?? [],
    is_published: true, // ← trigger fires, sets merchant_products.is_published = true automatically
  });

  if (insertError) {
    return { error: insertError.message };
  }

  // No manual merchant_products update needed — trigger handled it
  revalidatePath("/admin/products");
  revalidatePath("/admin/store-products");
  redirect("/admin/products");
}

export async function unpublishMerchantProduct(merchantProductId: string) {
  const supabase = await createClient();

  // Flip is_published on store_products → trigger syncs merchant_products
  const { error } = await supabase
    .from("store_products")
    .update({ is_published: false })
    .eq("merchant_product_id", merchantProductId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/products");
  revalidatePath("/admin/store-products");
  redirect("/admin/products");
}
