"use server";

import { createClient } from "@/utils/supabase/server";
import { categorySchema } from "@/lib/schemas/category";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createCategory(formData: FormData) {
  const raw = {
    name_en: formData.get("name_en") as string,
    name_ar: formData.get("name_ar") as string,
    slug: formData.get("slug") as string,
  };

  const parsed = categorySchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();

  // Check slug uniqueness before inserting
  const { data: existing } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", parsed.data.slug)
    .maybeSingle();

  if (existing) {
    return { error: { slug: ["This slug is already taken"] } };
  }

  // New category goes to the end of the display order
  const { data: lastCategory } = await supabase
    .from("categories")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextOrder = (lastCategory?.display_order ?? -1) + 1;

  const { error } = await supabase.from("categories").insert({
    ...parsed.data,
    display_order: nextOrder,
  });

  if (error) {
    return { error: { _form: [error.message] } };
  }

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function updateCategory(id: string, formData: FormData) {
  const raw = {
    name_en: formData.get("name_en") as string,
    name_ar: formData.get("name_ar") as string,
    slug: formData.get("slug") as string,
  };

  const parsed = categorySchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();

  // Check slug uniqueness, excluding this category's own row
  const { data: existing } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", parsed.data.slug)
    .neq("id", id)
    .maybeSingle();

  if (existing) {
    return { error: { slug: ["This slug is already taken"] } };
  }

  const { error } = await supabase
    .from("categories")
    .update(parsed.data)
    .eq("id", id);

  if (error) {
    return { error: { _form: [error.message] } };
  }

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}
