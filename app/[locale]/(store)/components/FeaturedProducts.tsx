import { SectionHeader } from "./SectionHeader";
import { ProductCard } from "./ProductCard";
import serumImage from "@/public/store/heroLeft.png";
import lipstickImage from "@/public/store/heroLeft.png";
import { getDictionary, type Dictionary } from "@/app/[locale]/dictionaries";
import { getLocale } from "@/lib/get-locale";

type ProductKey = keyof Dictionary["home"]["featured"]["products"];
type CategoryKey = keyof Dictionary["home"]["categories"]["items"];
type BadgeKey = keyof Dictionary["home"]["featured"]["badges"];

const PRODUCTS: {
  id: number;
  key: ProductKey;
  categoryKey: CategoryKey;
  badgeKey?: BadgeKey;
  badgeBg?: string;
  imgBg: string;
  image: typeof serumImage;
  price: number;
}[] = [
  {
    id: 1,
    key: "hydraGlowSerum",
    categoryKey: "skincare",
    badgeKey: "new",
    badgeBg: "var(--color-bloom)",
    imgBg: "var(--color-primary-light)",
    image: serumImage,
    price: 420,
  },
  {
    id: 2,
    key: "velvetMatteLipstick",
    categoryKey: "makeup",
    badgeKey: "best",
    badgeBg: "var(--color-tide)",
    imgBg: "var(--color-accent-light)",
    image: lipstickImage,
    price: 260,
  },
  {
    id: 3,
    key: "velvetMatteLipstick",
    categoryKey: "makeup",
    badgeKey: "best",
    badgeBg: "var(--color-tide)",
    imgBg: "var(--color-accent-light)",
    image: lipstickImage,
    price: 260,
  },
  {
    id: 4,
    key: "velvetMatteLipstick",
    categoryKey: "makeup",
    badgeKey: "best",
    badgeBg: "var(--color-tide)",
    imgBg: "var(--color-accent-light)",
    image: lipstickImage,
    price: 260,
  },
];

async function FeaturedProducts() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const featured = dict.home.featured;
  const categories = dict.home.categories.items;

  return (
    <section
      className="container mx-auto px-4 py-8"
      aria-labelledby="featured-heading"
    >
      <h2 id="featured-heading" className="sr-only">
        {featured.title}
      </h2>

      <SectionHeader
        title={featured.title}
        href="/shop"
        linkLabel={featured.viewAll}
      />

      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
        {PRODUCTS.map(({ key, categoryKey, badgeKey, ...product }) => (
          <ProductCard
            key={product.id}
            {...product}
            badge={badgeKey ? featured.badges[badgeKey] : undefined}
            category={categories[categoryKey]}
            name={featured.products[key].name}
            sub={featured.products[key].sub}
          />
        ))}
      </div>
    </section>
  );
}

export default FeaturedProducts;
