import { createClient } from "@/utils/supabase/server";
import { getUser } from "./get-user";

export type Profile = {
  id: string;
  role: "customer" | "merchant" | "super_admin";
  email?: string;
  full_name?: string;
  phone: string | null;
  avatar_url?: string;
};

export async function getUserProfile(): Promise<Profile | null> {
  const user = await getUser();
  if (!user) return null;

  console.log({ user });

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile;
}
