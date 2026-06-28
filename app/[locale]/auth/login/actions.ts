"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  console.log({ data });

  if (error) {
    redirect("/auth/login?error=invalid_credentials");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();
  console.log({ profile });

  if (profile?.role === "super_admin") {
    redirect("/admin");
  }
  if (profile?.role === "merchant") {
    redirect("/merchant");
  }

  redirect("/");
}
