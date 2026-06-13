import { CategoriesSection } from "./components/home/CategoriesSection";
import { RoutineSection } from "./components/home/RoutineSection";
import PromotionBannerSection from "./components/home/PromotionBanner";
import TrustStrip from "./components/home/TrustStrip";
import BestSellersSection from "./components/home/BestSellersSection";
import ShopByConcernSection from "./components/home/ShopByConcernSection";
import NewArrivalsSection from "./components/home/NewArrivalsSection";
import BrandStorySection from "./components/home/BrandStorySection";
import ShoppingPromiseSection from "./components/home/ShoppingPromiseSection";
import NewsletterSection from "./components/home/NewsletterSection";
import { SectionDivider } from "./components/SectionDivider";
import Link from "next/link";
import Hero from "./components/home/Hero";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-sand text-deep">
      {/* <Header /> */}
      <Hero />
      <TrustStrip />
      <SectionDivider variant="line" />
      <CategoriesSection />
      <NewArrivalsSection />
      <SectionDivider variant="line" />
      <section
        className="container mx-auto px-4 py-16 sm:py-20"
        aria-labelledby="routine-heading"
      >
        <div className="mb-4">
          <p className="mb-2 inline-flex rounded-full bg-primary-light px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-tide">
            Lumière routine
          </p>

          <div className="flex items-end justify-between gap-4">
            <div>
              <h2
                id="routine-heading"
                className="text-xl font-bold tracking-tight text-deep sm:text-2xl"
              >
                Morning glow routine
              </h2>

              <p className="mt-1 max-w-xl text-sm leading-relaxed text-text-secondary">
                A simple 3-step routine for fresh, hydrated skin before you
                start your day.
              </p>
            </div>

            <Link
              href="/shop/routines/morning-glow"
              className="hidden text-sm font-semibold text-tide no-underline transition hover:text-primary-dark sm:inline-flex"
            >
              View routine →
            </Link>
          </div>
        </div>

        <RoutineSection />
      </section>
      <PromotionBannerSection />
      <BestSellersSection />
      <ShopByConcernSection />
      <SectionDivider variant="line" />
      <BrandStorySection />
      <ShoppingPromiseSection />
      <NewsletterSection />
    </main>
  );
}
