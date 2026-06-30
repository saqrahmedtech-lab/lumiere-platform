"use server";

import { createClient } from "@/utils/supabase/server";
import { productSchema } from "@/lib/schemas/product";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: FormData) {
  const raw = {
    source: formData.get("source") as string,
    merchant_product_id: formData.get("merchant_product_id") as string | null,
    merchant_id: formData.get("merchant_id") as string | null,
    category_id: formData.get("category_id") as string,
    name_en: formData.get("name_en") as string,
    name_ar: formData.get("name_ar") as string,
    description_en: formData.get("description_en") as string,
    description_ar: formData.get("description_ar") as string,
    base_price: formData.get("base_price") as string,
    margin_percent: formData.get("margin_percent") as string,
  };

  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();

  // Guard: if source is 'merchant', make sure this merchant product hasn't
  // already been published since the picker was loaded (race condition check)
  if (parsed.data.source === "merchant") {
    const { data: existing } = await supabase
      .from("store_products")
      .select("id")
      .eq("merchant_product_id", parsed.data.merchant_product_id)
      .maybeSingle();

    if (existing) {
      return {
        error: {
          merchant_product_id: ["This product is already in the store"],
        },
      };
    }
  }

  const { data: finalPrice, error: rpcError } = await supabase.rpc(
    "compute_final_price",
    {
      base_price: parsed.data.base_price,
      margin_percent: parsed.data.margin_percent,
    },
  );

  if (rpcError) {
    return { error: { _form: [rpcError.message] } };
  }

  const insertPayload: Record<string, unknown> = {
    source: parsed.data.source,
    category_id: parsed.data.category_id,
    name_en: parsed.data.name_en,
    name_ar: parsed.data.name_ar,
    description_en: parsed.data.description_en || null,
    description_ar: parsed.data.description_ar || null,
    base_price: parsed.data.base_price,
    margin_percent: parsed.data.margin_percent,
    final_price: finalPrice,
    is_published: true,
  };

  if (parsed.data.source === "merchant") {
    insertPayload.merchant_product_id = parsed.data.merchant_product_id;
    // merchant_id auto-fills via the sync_merchant_id_from_merchant_product trigger
  } else if (parsed.data.merchant_id) {
    insertPayload.merchant_id = parsed.data.merchant_id;
  }

  const { error: insertError } = await supabase
    .from("store_products")
    .insert(insertPayload);

  if (insertError) {
    return { error: { _form: [insertError.message] } };
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function toggleProductPublished(id: string, isPublished: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("store_products")
    .update({ is_published: isPublished })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/products");
  return { success: true };
}

export async function deleteStoreProduct(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("store_products").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/products");
  return { success: true };
}
