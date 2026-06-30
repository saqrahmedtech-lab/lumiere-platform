import { createClient } from "@/utils/supabase/server";

export async function getActiveMerchants() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("merchants")
    .select("id, business_name")
    .eq("is_active", true)
    .order("business_name");

  if (error) {
    console.error("Failed to fetch merchants:", error.message);
    return [];
  }

  return data;
}
