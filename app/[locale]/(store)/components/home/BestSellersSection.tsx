import serumImage from "@/public/store/heroLeft.png";
import lipstickImage from "@/public/store/heroLeft.png";
import sunscreenImage from "@/public/store/heroLeft.png";
import bodyLotionImage from "@/public/store/heroLeft.png";
import { SectionHeader } from "./SectionHeader";
import { ProductCard } from "../ProductCard";
import { getDictionary, type Dictionary } from "@/app/[locale]/dictionaries";
import { getLocale } from "@/lib/get-locale";

type ProductKey = keyof Dictionary["home"]["bestSellers"]["products"];
type CategoryKey = keyof Dictionary["home"]["categories"]["items"];
type BadgeKey = keyof Dictionary["home"]["bestSellers"]["badges"];

const BEST_SELLERS: {
  id: number;
  slug: string;
  key: ProductKey;
  categoryKey: CategoryKey;
  badgeKey: BadgeKey;
  badgeBg: string;
  imgBg: string;
  image: typeof serumImage;
  price: number;
}[] = [
  {
    id: 101,
    slug: "hydra-glow-serum",
    key: "hydraGlowSerum",
    categoryKey: "skincare",
    badgeKey: "bestSeller",
    badgeBg: "var(--color-tide)",
    imgBg: "var(--color-primary-light)",
    image: serumImage,
    price: 420,
  },
  {
    id: 102,
    slug: "velvet-matte-lipstick",
    key: "velvetMatteLipstick",
    categoryKey: "makeup",
    badgeKey: "bestSeller",
    badgeBg: "var(--color-bloom)",
    imgBg: "var(--color-accent-light)",
    image: lipstickImage,
    price: 260,
  },
  {
    id: 103,
    slug: "daily-sun-shield-spf50",
    key: "dailySunShieldSpf50",
    categoryKey: "sunCare",
    badgeKey: "topRated",
    badgeBg: "var(--color-drift)",
    imgBg: "var(--color-warning-light)",
    image: sunscreenImage,
    price: 350,
  },
  {
    id: 104,
    slug: "silk-body-lotion",
    key: "silkBodyLotion",
    categoryKey: "bodyCare",
    badgeKey: "popular",
    badgeBg: "var(--color-primary-dark)",
    imgBg: "var(--color-primary-light)",
    image: bodyLotionImage,
    price: 310,
  },
];

async function BestSellersSection() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const bestSellers = dict.home.bestSellers;
  const categories = dict.home.categories.items;

  return (
    <section
      className="container mx-auto px-4 py-8"
      aria-labelledby="best-sellers-heading"
    >
      <div className="mb-1">
        <SectionHeader
          title={bestSellers.title}
          href="/shop?sort=best-sellers"
          linkLabel={bestSellers.viewAll}
        />

        <p className="-mt-2 mb-4 text-sm text-text-secondary/70">
          {bestSellers.description}
        </p>
      </div>

      <h2 id="best-sellers-heading" className="sr-only">
        {bestSellers.title}
      </h2>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {BEST_SELLERS.map(({ key, categoryKey, badgeKey, ...product }) => (
          <ProductCard
            key={product.id}
            {...product}
            badge={bestSellers.badges[badgeKey]}
            category={categories[categoryKey]}
            name={bestSellers.products[key].name}
            sub={bestSellers.products[key].sub}
          />
        ))}
      </div>
    </section>
  );
}

export default BestSellersSection;
