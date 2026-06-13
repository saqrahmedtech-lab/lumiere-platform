import {
  Droplets,
  Sparkles,
  ShieldCheck,
  Smile,
  Sun,
  WandSparkles,
} from "lucide-react";
import Link from "next/link";
import { SectionHeader } from "./SectionHeader";

const CONCERNS = [
  {
    icon: Droplets,
    title: "Hydration",
    description: "For dry, tired skin",
    href: "/shop?concern=hydration",
    color: "var(--color-tide)",
    bg: "var(--color-primary-light)",
  },
  {
    icon: Sparkles,
    title: "Glow",
    description: "Bright, fresh finish",
    href: "/shop?concern=glow",
    color: "var(--color-bloom)",
    bg: "var(--color-accent-light)",
  },
  {
    icon: Sun,
    title: "Sun protection",
    description: "Daily SPF essentials",
    href: "/shop?concern=sun-protection",
    color: "var(--color-drift)",
    bg: "var(--color-warning-light)",
  },
  {
    icon: ShieldCheck,
    title: "Sensitive skin",
    description: "Gentle care picks",
    href: "/shop?concern=sensitive-skin",
    color: "var(--color-primary-dark)",
    bg: "var(--color-primary-light)",
  },
  {
    icon: WandSparkles,
    title: "Long-lasting makeup",
    description: "Looks that stay fresh",
    href: "/shop?concern=long-lasting-makeup",
    color: "var(--color-bloom)",
    bg: "var(--color-accent-light)",
  },
  {
    icon: Smile,
    title: "Body softness",
    description: "Smooth body care",
    href: "/shop?concern=body-softness",
    color: "var(--color-tide)",
    bg: "var(--color-info-light)",
  },
];

function ShopByConcernSection() {
  return (
    <section
      className="bg-surface px-4 py-8"
      aria-labelledby="shop-by-concern-heading"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          title="Shop by concern"
          href="/shop"
          linkLabel="Explore all"
        />

        <p className="-mt-2 mb-4 max-w-xl text-sm leading-relaxed text-text-secondary/70">
          Not sure where to start? Choose your beauty goal and find products
          made for it.
        </p>

        <h2 id="shop-by-concern-heading" className="sr-only">
          Shop by concern
        </h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CONCERNS.map(
            ({ icon: Icon, title, description, href, color, bg }) => (
              <Link
                key={title}
                href={href}
                className="group relative overflow-hidden rounded-[1.5rem] border border-border/70 bg-pearl p-4 no-underline shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-drift/70 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tide/40"
              >
                {/* Gradient background */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-80 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background: `
                    radial-gradient(circle at 88% 18%, ${color}30 0%, transparent 34%),
                    linear-gradient(135deg, ${bg} 0%, var(--color-pearl) 58%, var(--color-surface-raised) 100%)
                  `,
                  }}
                />

                {/* Glow */}
                <div
                  aria-hidden="true"
                  className="absolute -end-10 -top-10 size-28 rounded-full opacity-35 blur-2xl transition-all duration-500 group-hover:scale-125 group-hover:opacity-60"
                  style={{ backgroundColor: color }}
                />

                <div className="relative z-10 flex items-center gap-4">
                  <div
                    className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-pearl/85 shadow-[inset_0_0_0_1px_rgba(196,168,130,0.25)] backdrop-blur-sm transition-transform duration-300 group-hover:scale-105"
                    style={{ color }}
                  >
                    <Icon size={23} strokeWidth={1.8} aria-hidden="true" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-deep">{title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-text-secondary/70">
                      {description}
                    </p>
                  </div>
                </div>
              </Link>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

export default ShopByConcernSection;
