import serumImage from "@/public/store/heroLeft.png";
import lipstickImage from "@/public/store/heroLeft.png";
import sunscreenImage from "@/public/store/heroLeft.png";
import bodyLotionImage from "@/public/store/heroLeft.png";
import { SectionHeader } from "./SectionHeader";
import { ProductCard } from "../ProductCard";

const NEW_ARRIVALS = [
  {
    id: 201,
    slug: "rose-water-glow-toner",
    badge: "New",
    badgeBg: "var(--color-bloom)",
    imgBg: "var(--color-accent-light)",
    image: serumImage,
    category: "Skincare",
    name: "Rose Water Glow Toner",
    sub: "Soft daily refresh",
    price: 280,
  },
  {
    id: 202,
    slug: "pearl-shine-lip-oil",
    badge: "Just in",
    badgeBg: "var(--color-tide)",
    imgBg: "var(--color-primary-light)",
    image: lipstickImage,
    category: "Makeup",
    name: "Pearl Shine Lip Oil",
    sub: "Glossy hydrated lips",
    price: 220,
  },
  {
    id: 203,
    slug: "aqua-light-spf50",
    badge: "New",
    badgeBg: "var(--color-drift)",
    imgBg: "var(--color-warning-light)",
    image: sunscreenImage,
    category: "Sun care",
    name: "Aqua Light SPF50",
    sub: "No white cast finish",
    price: 390,
  },
  {
    id: 204,
    slug: "coconut-soft-body-cream",
    badge: "Fresh",
    badgeBg: "var(--color-primary-dark)",
    imgBg: "var(--color-primary-light)",
    image: bodyLotionImage,
    category: "Body care",
    name: "Coconut Soft Body Cream",
    sub: "Smooth all-day moisture",
    price: 340,
  },
];

function NewArrivalsSection() {
  return (
    <section
      className="bg-surface px-4 py-8"
      aria-labelledby="new-arrivals-heading"
    >
      <div className="mx-auto container">
        <SectionHeader
          title="New arrivals"
          href="/shop?sort=new-arrivals"
          linkLabel="See all"
        />

        <p className="-mt-2 mb-4 max-w-xl text-sm leading-relaxed text-text-secondary/70">
          Fresh beauty picks just landed.
        </p>

        <h2 id="new-arrivals-heading" className="sr-only">
          New arrivals
        </h2>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {NEW_ARRIVALS.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default NewArrivalsSection;
