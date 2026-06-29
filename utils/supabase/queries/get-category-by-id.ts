import { createClient } from "@/utils/supabase/server";

export async function getCategoryById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch category:", error.message);
    return null;
  }

  return data;
}
