import serumImage from "@/public/store/heroLeft.png";
import lipstickImage from "@/public/store/heroLeft.png";
import sunscreenImage from "@/public/store/heroLeft.png";
import bodyLotionImage from "@/public/store/heroLeft.png";
import { SectionHeader } from "./SectionHeader";
import { ProductCard } from "../ProductCard";

const BEST_SELLERS = [
  {
    id: 101,
    slug: "hydra-glow-serum",
    badge: "Best seller",
    badgeBg: "var(--color-tide)",
    imgBg: "var(--color-primary-light)",
    image: serumImage,
    category: "Skincare",
    name: "Hydra Glow Serum",
    sub: "Daily brightening serum",
    price: 420,
  },
  {
    id: 102,
    slug: "velvet-matte-lipstick",
    badge: "Best seller",
    badgeBg: "var(--color-bloom)",
    imgBg: "var(--color-accent-light)",
    image: lipstickImage,
    category: "Makeup",
    name: "Velvet Matte Lipstick",
    sub: "Soft coral finish",
    price: 260,
  },
  {
    id: 103,
    slug: "daily-sun-shield-spf50",
    badge: "Top rated",
    badgeBg: "var(--color-drift)",
    imgBg: "var(--color-warning-light)",
    image: sunscreenImage,
    category: "Sun care",
    name: "Daily Sun Shield SPF50",
    sub: "Lightweight protection",
    price: 350,
  },
  {
    id: 104,
    slug: "silk-body-lotion",
    badge: "Popular",
    badgeBg: "var(--color-primary-dark)",
    imgBg: "var(--color-primary-light)",
    image: bodyLotionImage,
    category: "Body care",
    name: "Silk Body Lotion",
    sub: "Soft hydrated skin",
    price: 310,
  },
];

function BestSellersSection() {
  return (
    <section
      className="container mx-auto px-4 py-8"
      aria-labelledby="best-sellers-heading"
    >
      <div className="mb-1">
        <SectionHeader
          title="Best sellers"
          href="/shop?sort=best-sellers"
          linkLabel="See all"
        />

        <p className="-mt-2 mb-4 text-sm text-text-secondary/70">
          Loved by Lumière shoppers across Egypt.
        </p>
      </div>

      <h2 id="best-sellers-heading" className="sr-only">
        Best sellers
      </h2>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {BEST_SELLERS.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
}

export default BestSellersSection;
