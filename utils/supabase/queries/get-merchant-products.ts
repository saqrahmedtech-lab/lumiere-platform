import { createClient } from "@/utils/supabase/server";

export type MerchantProductOption = {
  id: string;
  name_en: string;
  name_ar: string | null;
  description_en: string | null;
  description_ar: string | null;
  base_price: number;
  images: string[] | null;
  merchant_id: string;
  merchants: { business_name: string } | null;
  is_in_store: boolean;
};

export async function getMerchantProductsForPicker(
  search?: string,
): Promise<MerchantProductOption[]> {
  const supabase = await createClient();

  const { data: published } = await supabase
    .from("store_products")
    .select("merchant_product_id")
    .not("merchant_product_id", "is", null);

  const inStoreIds = new Set(
    (published ?? []).map((p) => p.merchant_product_id),
  );

  let query = supabase
    .from("merchant_products")
    .select(
      "id, name_en, name_ar, description_en, description_ar, base_price, images, merchant_id, merchants(business_name)",
    )
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (search && search.trim().length > 0) {
    const term = search.trim();
    query = query.or(`name_en.ilike.%${term}%,name_ar.ilike.%${term}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to fetch merchant products:", error.message);
    return [];
  }

  return (data ?? []).map((product) => ({
    ...product,
    is_in_store: inStoreIds.has(product.id),
  }));
}
