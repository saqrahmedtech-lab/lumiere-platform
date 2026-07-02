import { createClient } from "@/utils/supabase/server";

export async function getCategories(search?: string) {
  const supabase = await createClient();

  let query = supabase
    .from("categories")
    .select(
      "id, name_en, name_ar, slug, created_at, parent_id, display_order, image, is_published, description_en, description_ar",
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

  return data;
}
