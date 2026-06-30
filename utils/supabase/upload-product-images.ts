"use client";

import { PendingImage } from "@/components/ui/product-image-picker";
import { createClient } from "@/utils/supabase/client";

export async function uploadProductImages(
  images: PendingImage[],
): Promise<string[]> {
  const supabase = createClient();
  const urls: string[] = [];

  for (const image of images) {
    const ext = image.file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage
      .from("product-images")
      .upload(path, image.file, { cacheControl: "3600", upsert: false });

    if (error) {
      throw new Error(`Failed to upload image: ${error.message}`);
    }

    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    urls.push(data.publicUrl);
  }

  return urls;
}
