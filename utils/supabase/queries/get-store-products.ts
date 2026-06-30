import { createClient } from "@/utils/supabase/server";

export type StoreProductRow = {
  id: string;
  source: "manual" | "merchant";
  name_en: string;
  name_ar: string;
  base_price: number;
  margin_percent: number;
  final_price: number;
  is_published: boolean;
  created_at: string;
  categories: { name_en: string } | null;
  merchants: { business_name: string } | null;
};

export async function getStoreProducts(
  search?: string,
): Promise<StoreProductRow[]> {
  const supabase = await createClient();

  let query = supabase
    .from("store_products")
    .select(
      "id, source, name_en, name_ar, base_price, margin_percent, final_price, is_published, created_at, categories(name_en), merchants(business_name)",
    )
    .order("created_at", { ascending: false });

  if (search && search.trim().length > 0) {
    const term = search.trim();
    query = query.or(`name_en.ilike.%${term}%,name_ar.ilike.%${term}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to fetch store products:", error.message);
    return [];
  }

  return data as unknown as StoreProductRow[];
}
