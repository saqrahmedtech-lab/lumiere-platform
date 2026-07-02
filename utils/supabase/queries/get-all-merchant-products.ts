import { createClient } from "@/utils/supabase/server";

export type MerchantProductRow = {
  id: string;
  name_en: string;
  name_ar: string | null;
  description_en: string | null;
  description_ar: string | null;
  base_price: number;
  is_published: boolean;
  images: string[] | null;
  created_at: string;
  merchant_id: string;
  merchants: { business_name: string } | null;
};

interface GetMerchantProductsOptions {
  search?: string;
  isPublished?: boolean;
  merchantId?: string;
}

export async function getMerchantProducts(
  options: GetMerchantProductsOptions | string = {},
): Promise<MerchantProductRow[]> {
  const supabase = await createClient();

  // Accept a bare string for backwards compat (search-only callers)
  const { search, isPublished, merchantId } =
    typeof options === "string"
      ? { search: options, isPublished: undefined, merchantId: undefined }
      : options;

  let query = supabase
    .from("merchant_products")
    .select(
      "id, name_en, name_ar, description_en, base_price, is_published, images, created_at, merchant_id, merchants(business_name)",
    )
    .order("created_at", { ascending: false });

  if (search && search.trim().length > 0) {
    const term = search.trim();
    query = query.or(`name_en.ilike.%${term}%,name_ar.ilike.%${term}%`);
  }

  if (isPublished !== undefined) {
    query = query.eq("is_published", isPublished);
  }

  if (merchantId) {
    query = query.eq("merchant_id", merchantId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to fetch merchant products:", error.message);
    return [];
  }

  return data as unknown as MerchantProductRow[];
}
