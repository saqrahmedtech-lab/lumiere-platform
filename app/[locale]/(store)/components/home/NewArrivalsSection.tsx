import serumImage from "@/public/store/heroLeft.png";
import lipstickImage from "@/public/store/heroLeft.png";
import sunscreenImage from "@/public/store/heroLeft.png";
import bodyLotionImage from "@/public/store/heroLeft.png";
import { SectionHeader } from "./SectionHeader";
import { ProductCard } from "../ProductCard";
import { getDictionary, type Dictionary } from "@/app/[locale]/dictionaries";
import { getLocale } from "@/lib/get-locale";

type ProductKey = keyof Dictionary["home"]["newArrivals"]["products"];
type CategoryKey = keyof Dictionary["home"]["categories"]["items"];
type BadgeKey = keyof Dictionary["home"]["newArrivals"]["badges"];

const NEW_ARRIVALS: {
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
    id: 201,
    slug: "rose-water-glow-toner",
    key: "roseWaterGlowToner",
    categoryKey: "skincare",
    badgeKey: "new",
    badgeBg: "var(--color-bloom)",
    imgBg: "var(--color-accent-light)",
    image: serumImage,
    price: 280,
  },
  {
    id: 202,
    slug: "pearl-shine-lip-oil",
    key: "pearlShineLipOil",
    categoryKey: "makeup",
    badgeKey: "justIn",
    badgeBg: "var(--color-tide)",
    imgBg: "var(--color-primary-light)",
    image: lipstickImage,
    price: 220,
  },
  {
    id: 203,
    slug: "aqua-light-spf50",
    key: "aquaLightSpf50",
    categoryKey: "sunCare",
    badgeKey: "new",
    badgeBg: "var(--color-drift)",
    imgBg: "var(--color-warning-light)",
    image: sunscreenImage,
    price: 390,
  },
  {
    id: 204,
    slug: "coconut-soft-body-cream",
    key: "coconutSoftBodyCream",
    categoryKey: "bodyCare",
    badgeKey: "fresh",
    badgeBg: "var(--color-primary-dark)",
    imgBg: "var(--color-primary-light)",
    image: bodyLotionImage,
    price: 340,
  },
];

async function NewArrivalsSection() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const newArrivals = dict.home.newArrivals;
  const categories = dict.home.categories.items;

  return (
    <section
      className="bg-surface px-4 py-10 sm:py-20"
      aria-labelledby="new-arrivals-heading"
    >
      <div className="mx-auto container">
        <SectionHeader
          title={newArrivals.title}
          href="/shop?sort=new-arrivals"
          linkLabel={newArrivals.viewAll}
        />

        <p className="-mt-2 mb-4 max-w-xl text-sm leading-relaxed text-text-secondary/70">
          {newArrivals.description}
        </p>

        <h2 id="new-arrivals-heading" className="sr-only">
          {newArrivals.title}
        </h2>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {NEW_ARRIVALS.map(({ key, categoryKey, badgeKey, ...product }) => (
            <ProductCard
              key={product.id}
              {...product}
              badge={newArrivals.badges[badgeKey]}
              category={categories[categoryKey]}
              name={newArrivals.products[key].name}
              sub={newArrivals.products[key].sub}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default NewArrivalsSection;
