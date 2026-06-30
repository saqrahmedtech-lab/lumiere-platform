import { createClient } from "@/utils/supabase/server";

export type ProductForEdit = {
  id: string;
  source: "manual" | "merchant";
  category_id: string;
  name_en: string;
  name_ar: string;
  description_en: string | null;
  description_ar: string | null;
  base_price: number;
  margin_percent: number;
  final_price: number;
  merchant_id: string | null;
  merchant_product_id: string | null;
  images: string[] | null;
  merchant_products: {
    name_en: string;
    merchants: { business_name: string } | null;
  } | null;
};

export async function getProductById(id: string): Promise<ProductForEdit | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("store_products")
    .select(
      "id, source, category_id, name_en, name_ar, description_en, description_ar, base_price, margin_percent, final_price, merchant_id, merchant_product_id, images, merchant_products(name_en, merchants(business_name))",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch product:", error.message);
    return null;
  }

  return data as unknown as ProductForEdit;
}
