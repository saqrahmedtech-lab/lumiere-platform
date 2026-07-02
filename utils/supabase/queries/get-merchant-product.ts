import { createClient } from "@/utils/supabase/server";

export type MerchantProductDetail = {
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
  merchants: { business_name: string; contact_phone: string | null } | null;
};

export async function getMerchantProduct(
  id: string,
): Promise<MerchantProductDetail | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("merchant_products")
    .select(
      "id, name_en, name_ar, description_en, description_ar, base_price, is_published, images, created_at, merchant_id, merchants(business_name, contact_phone)",
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Failed to fetch merchant product:", error.message);
    return null;
  }

  return data as unknown as MerchantProductDetail;
}
