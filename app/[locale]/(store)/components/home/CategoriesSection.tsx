import { Droplets, Sparkles, Sun, Leaf } from "lucide-react";

import skincareImage from "@/public/store/logo.png";
import makeupImage from "@/public/store/logo.png";
import suncareImage from "@/public/store/logo.png";
import bodycareImage from "@/public/store/logo.png";
import { getDictionary, type Dictionary } from "@/app/[locale]/dictionaries";
import { getLocale } from "@/lib/get-locale";

import { SectionHeader } from "./SectionHeader";
import CategoryCard from "../CategoryCard";

type CategoryKey = keyof Dictionary["home"]["categories"]["items"];

const CATEGORIES: {
  key: CategoryKey;
  slug: string;
  icon: typeof Droplets;
  count: number;
  bg: string;
  color: string;
  image: typeof skincareImage;
}[] = [
  {
    key: "skincare",
    slug: "skincare",
    icon: Droplets,
    count: 48,
    bg: "var(--color-info-light)",
    color: "var(--color-tide)",
    image: skincareImage,
  },
  {
    key: "makeup",
    slug: "makeup",
    icon: Sparkles,
    count: 62,
    bg: "var(--color-accent-light)",
    color: "var(--color-bloom)",
    image: makeupImage,
  },
  {
    key: "sunCare",
    slug: "sun-care",
    icon: Sun,
    count: 19,
    bg: "var(--color-warning-light)",
    color: "var(--color-drift)",
    image: suncareImage,
  },
  {
    key: "bodyCare",
    slug: "body-care",
    icon: Leaf,
    count: 33,
    bg: "var(--color-primary-light)",
    color: "var(--color-primary-dark)",
    image: bodycareImage,
  },
];

export async function CategoriesSection() {
  const locale = await getLocale();
  const dict = (await getDictionary(locale)).home.categories;

  return (
    <section
      className="border-t border-tide/10 bg-surface px-4 py-8"
      aria-labelledby="categories-heading"
    >
      <div className="mx-auto container">
        <SectionHeader
          title={dict.title}
          href="/shop"
          linkLabel={dict.viewAll}
        />

        <h2 id="categories-heading" className="sr-only">
          {dict.title}
        </h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map(({ key, slug, icon, count, color, bg, image }) => (
            <CategoryCard
              key={key}
              icon={icon}
              slug={slug}
              label={dict.items[key]}
              productsLabel={dict.productsCount.replace(
                "{count}",
                String(count),
              )}
              shopNowLabel={dict.shopNow}
              color={color}
              bg={bg}
              image={image}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
