"use client";

import { createClient } from "@/utils/supabase/client";
import type { CategoryRow } from "./get-categories";

export async function getCategoriesClient(
  search?: string,
): Promise<CategoryRow[]> {
  const supabase = createClient();

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
