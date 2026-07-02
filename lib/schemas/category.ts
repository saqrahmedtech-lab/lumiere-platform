import { z } from "zod";

export const categorySchema = z.object({
  name_en: z.string().min(2, "English name must be at least 2 characters"),
  name_ar: z.string().min(2, "Arabic name must be at least 2 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase letters, numbers, and hyphens only",
    ),
  image: z.string().url().optional().nullable(),
  is_published: z.boolean().default(true),
  description_en: z.string().optional(),
  description_ar: z.string().optional(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
