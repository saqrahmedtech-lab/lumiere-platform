import { SectionDivider } from "./components/SectionDivider";
import { CategoriesSection } from "./components/home/CategoriesSection";
import Header from "./components/home/header";
import FeaturedProductsSection from "./components/home/FeaturedProductsSection";
import PromotionBannerSection from "./components/home/PromotionBanner";
import TrustStrip from "./components/home/TrustStrip";
import BestSellersSection from "./components/home/BestSellersSection";
import ShopByConcernSection from "./components/home/ShopByConcernSection";
import NewArrivalsSection from "./components/home/NewArrivalsSection";
import BrandStorySection from "./components/home/BrandStorySection";
import ShoppingPromiseSection from "./components/home/ShoppingPromiseSection";
import NewsletterSection from "./components/home/NewsletterSection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-sand text-deep">
      <Header />
      <TrustStrip />
      <CategoriesSection />
      <div className="h-2" />
      <NewArrivalsSection />
      <div className="h-2" />
      <FeaturedProductsSection />
      <div className="h-2" />
      <PromotionBannerSection />
      <div className="h-2" />
      <BestSellersSection />
      <div className="h-2" />
      <ShopByConcernSection />
      <div className="h-2" />
      <BrandStorySection />
      <div className="h-2" />
      <ShoppingPromiseSection />
      <div className="h-2" />
      <NewsletterSection />

      {/* spacer */}
      {/* <SectionDivider /> */}

      {/* ── Shop by concern ────────────────────────────────────────────────── */}
      {/* <section className="px-4 pt-6 pb-3" aria-labelledby="concern-heading">
        <h2
          id="concern-heading"
          className="text-base mb-4 text-deep font-(--font-display,Georgia,serif)"
        >
          Shop by concern
        </h2>
        <div className="flex gap-2 flex-wrap">
          {CONCERNS.map((concern) => {
            const isActive = activeConcern === concern;
            return (
              <button
                key={concern}
                // onClick={() => setActiveConcern(concern)}
                className={`rounded-full font-medium cursor-pointer whitespace-nowrap py-1.5 px-3.5 text-[12px] border-[0.5px] ${
                  isActive
                    ? "bg-primary-light text-primary-dark border-tide"
                    : "bg-pearl text-text-secondary border-[color-mix(in_srgb,var(--color-drift)_30%,transparent)]"
                }`}
              >
                {concern}
              </button>
            );
          })}
        </div>
      </section> */}

      {/* <SectionDivider /> */}

      {/* ── Trust strip ────────────────────────────────────────────────────── */}
      {/* <section
        className="grid grid-cols-3 gap-2 px-4 py-4 bg-pearl"
        aria-label="Why shop with Lumière"
      >
        {TRUST_ITEMS.map(({ icon: Icon, label, sub }) => (
          <div key={label} className="text-center px-1.5 py-2.5">
            <div className="flex justify-center mb-1.5">
              <Icon size={20} color="var(--color-tide)" aria-hidden="true" />
            </div>
            <p className="font-semibold mb-0.5 text-deep text-[12px]">
              {label}
            </p>
            <p className="leading-[1.4] text-text-tertiary text-[11px]">
              {sub}
            </p>
          </div>
        ))}
      </section> */}

      {/* <SectionDivider />
      <div className="h-2" /> */}

      {/* ── Order tracking ─────────────────────────────────────────────────── */}
      {/* <section
        className="mx-4 mb-2 rounded-2xl p-4 bg-pearl border-[0.5px] border-[color-mix(in_srgb,var(--color-drift)_30%,transparent)]"
        aria-labelledby="track-heading"
      >
        <div className="flex items-center gap-2 mb-1">
          <Package size={16} color="var(--color-tide)" aria-hidden="true" />
          <h2
            id="track-heading"
            className="font-semibold text-deep text-[14px]"
          >
            Track your order
          </h2>
        </div>
        <p className="mb-3 text-text-tertiary text-[12px]">
          No account needed — just your order ID and phone number
        </p>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Order ID · e.g. LUM-00847"
            className="flex-1 rounded-lg px-3 py-2 text-sm outline-none text-[13px] bg-surface-sunken text-deep border-[0.5px] border-drift font-(--font-mono,'JetBrains_Mono',monospace)"
          />
          <Input
            type="tel"
            placeholder="Phone"
            className="rounded-lg px-3 py-2 text-sm outline-none max-w-30 text-[13px] bg-surface-sunken text-deep border-[0.5px] border-drift"
            aria-label="Phone number"
          />
          <a
            href={orderId ? `/order/${orderId.trim()}` : "#"}
            className="rounded-lg px-3.5 py-2 font-medium text-white cursor-pointer whitespace-nowrap no-underline text-[13px] bg-tide"
          >
            Track
          </a>
        </div>
      </section> */}

      {/* <div className="h-2" /> */}
    </main>
  );
}
