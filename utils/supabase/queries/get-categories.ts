import { createClient } from "@/utils/supabase/server";

export type CategoryRow = {
  id: string;
  name_en: string;
  name_ar: string;
  description_en: string | null;
  description_ar: string | null;
  slug: string;
  image: string | null;
  is_published: boolean;
  display_order: number;
  parent_id: string | null;
  created_at: string;
  store_products: {
    id: string;
    name_en: string;
    final_price: number;
    is_published: boolean;
  }[];
  product_count: number; // derived client-side from store_products.length
};

export async function getCategories(search?: string): Promise<CategoryRow[]> {
  const supabase = await createClient();

  let query = supabase
    .from("categories")
    .select(
      `id, name_en, name_ar, description_en, description_ar,
       slug, image, is_published, display_order, parent_id, created_at,
       store_products(id, name_en, final_price, is_published)`,
    )
    .order("display_order", { ascending: true });

  if (search && search.trim().length > 0) {
    const term = search.trim();
    query = query.or(
      `name_en.ilike.%${term}%,name_ar.ilike.%${term}%,slug.ilike.%${term}%`,
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to fetch categories:", error.message);
    return [];
  }

  return (data ?? []).map((cat) => ({
    ...cat,
    store_products: cat.store_products ?? [],
    product_count: cat.store_products?.length ?? 0,
  }));
}
