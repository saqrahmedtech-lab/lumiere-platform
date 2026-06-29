"use client";

import { createClient } from "@/utils/supabase/client";

export async function getCategoriesClient(search?: string) {
  const supabase = createClient();

  let query = supabase
    .from("categories")
    .select("*")
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
