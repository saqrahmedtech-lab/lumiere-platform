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
    image: (formData.get("image") as string | null) || null,
    is_published: formData.get("is_published") === "true",
    description_en: (formData.get("description_en") as string | null) || undefined,
    description_ar: (formData.get("description_ar") as string | null) || undefined,
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
    description_en: parsed.data.description_en || null,
    description_ar: parsed.data.description_ar || null,
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
    image: (formData.get("image") as string | null) || null,
    is_published: formData.get("is_published") === "true",
    description_en: (formData.get("description_en") as string | null) || undefined,
    description_ar: (formData.get("description_ar") as string | null) || undefined,
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
    .update({
      ...parsed.data,
      description_en: parsed.data.description_en || null,
      description_ar: parsed.data.description_ar || null,
    })
    .eq("id", id);

  if (error) {
    return { error: { _form: [error.message] } };
  }

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function updateCategoryPublished(
  id: string,
  isPublished: boolean,
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("categories")
    .update({ is_published: isPublished })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/categories");
  return { success: true };
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();

  const { count, error: countError } = await supabase
    .from("store_products")
    .select("id", { count: "exact", head: true })
    .eq("category_id", id);

  if (countError) {
    return { error: countError.message };
  }

  if (count && count > 0) {
    return {
      error: `Can't delete — ${count} product${count > 1 ? "s are" : " is"} using this category. Reassign or remove ${count > 1 ? "them" : "it"} first.`,
    };
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/categories");
  return { success: true };
}

export async function updateCategoryOrder(orderedIds: string[]) {
  const supabase = await createClient();

  const updates = orderedIds.map((id, index) =>
    supabase.from("categories").update({ display_order: index }).eq("id", id),
  );

  const results = await Promise.all(updates);

  const failed = results.find((r) => r.error);
  if (failed?.error) {
    console.error("Failed to update category order:", failed.error.message);
    return { error: failed.error.message };
  }

  revalidatePath("/admin/categories");
  return { success: true };
}
