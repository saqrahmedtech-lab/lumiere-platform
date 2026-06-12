import {
  Truck,
  ShieldCheck,
  Banknote,
  Droplets,
  Sparkles,
  Sun,
  Leaf,
  Package,
} from "lucide-react";

import { SectionDivider } from "./components/SectionDivider";
import { SectionHeader } from "./components/SectionHeader";
import { ProductCard } from "./components/ProductCard";
import { Product } from "./types/store.types";

// ─── Data ─────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    icon: Droplets,
    label: "Skincare",
    count: 48,
    bg: "var(--color-info-light)",
    color: "var(--color-tide)",
  },
  {
    icon: Sparkles,
    label: "Makeup",
    count: 62,
    bg: "var(--color-accent-light)",
    color: "var(--color-bloom)",
  },
  {
    icon: Sun,
    label: "Sun care",
    count: 19,
    bg: "var(--color-warning-light)",
    color: "var(--color-drift)",
  },
  {
    icon: Leaf,
    label: "Body care",
    count: 33,
    bg: "var(--color-primary-light)",
    color: "var(--color-primary-dark)",
  },
];

const PRODUCTS: Product[] = [
  {
    id: 1,
    badge: "New",
    badgeBg: "var(--color-bloom)",
    imgBg: "var(--color-info-light)",
    icon: Droplets,
    iconColor: "var(--color-tide)",
    category: "Skincare",
    name: "Rose Water Toner",
    sub: "200ml · hydrating",
    price: 185,
  },
  {
    id: 2,
    badge: "Best seller",
    badgeBg: "var(--color-tide)",
    imgBg: "var(--color-accent-light)",
    icon: Sparkles,
    iconColor: "var(--color-bloom)",
    category: "Makeup",
    name: "Velvet Lip Stain",
    sub: "6 shades · long wear",
    price: 240,
  },
  {
    id: 3,
    badge: null,
    badgeBg: null,
    imgBg: "var(--color-warning-light)",
    icon: Sun,
    iconColor: "var(--color-drift)",
    category: "Sun care",
    name: "SPF 50 Sunscreen",
    sub: "100ml · oil-free",
    price: 320,
  },
  {
    id: 4,
    badge: null,
    badgeBg: null,
    imgBg: "var(--color-info-light)",
    icon: Leaf,
    iconColor: "var(--color-tide)",
    category: "Body care",
    name: "Aloe Body Lotion",
    sub: "300ml · soothing",
    price: 145,
  },
];

const CONCERNS = ["All", "Anti-aging", "Brightening", "Hydration", "Acne care"];

const TRUST_ITEMS = [
  {
    icon: Truck,
    label: "Fast delivery",
    sub: "Cairo 1–2 days, all Egypt 3–5 days",
  },
  {
    icon: Banknote,
    label: "Cash on delivery",
    sub: "Pay when your order arrives",
  },
  {
    icon: ShieldCheck,
    label: "100% authentic",
    sub: "Every product verified before shipping",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const activeConcern = "All";
  const orderId = "jhbjhb-jhb4n-347ybu43y-100";
  const phone = "010123123";
  return (
    <main className="min-h-screen bg-sand text-deep">
      {/* ── Shop by category ───────────────────────────────────────────────── */}
      <section className="px-4 pt-6 pb-3" aria-labelledby="categories-heading">
        <SectionHeader title="Shop by category" href="/shop" linkLabel="All" />
        <div id="categories-heading" className="sr-only">
          Shop by category
        </div>
        <div className="grid grid-cols-4 gap-2">
          {CATEGORIES.map(({ icon: Icon, label, count, color }) => (
            <a
              key={label}
              href={`/shop/${label.toLowerCase().replace(" ", "-")}`}
              className="rounded-xl py-3.5 px-2 text-center cursor-pointer no-underline bg-pearl border-[0.5px] border-[color-mix(in_srgb,var(--color-drift)_30%,transparent)"
            >
              <div
                className="flex items-center justify-center mx-auto mb-1.5 text-[22px]"
                style={{ color }}
              >
                <Icon size={22} aria-hidden="true" />
              </div>
              <p className="font-medium text-deep text-[12px]">{label}</p>
              <p className="mt-0.5 text-tertiary text-[11px]">
                {count} products
              </p>
            </a>
          ))}
        </div>
      </section>

      <SectionDivider />

      {/* ── Featured products ──────────────────────────────────────────────── */}
      <section className="px-4 pt-6 pb-3" aria-labelledby="featured-heading">
        <div id="featured-heading" className="sr-only">
          Featured products
        </div>
        <SectionHeader
          title="Featured products"
          href="/shop"
          linkLabel="See all"
        />
        <div className="grid grid-cols-2 gap-2.5">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>

      {/* ── Promo banner ───────────────────────────────────────────────────── */}
      <div className="px-4 mb-2">
        <div
          className="rounded-2xl p-5 flex items-center justify-between bg-bloom"
          role="complementary"
          aria-label="Promotion"
        >
          <div>
            <p className="uppercase font-medium mb-1 text-[10px] tracking-[0.08em] text-[rgba(255,255,255,0.75)]">
              Limited time
            </p>
            <p className="text-white leading-snug text-[17px] font-(--font-display,Georgia,serif)">
              Free delivery on orders over 500 EGP
            </p>
            <p className="mt-1 text-[12px] text-[rgba(255,255,255,0.80)]">
              No code needed · auto-applied at checkout
            </p>
          </div>
          <button className="rounded-lg font-semibold cursor-pointer ml-4 shrink-0 py-2 px-4 text-[12px] whitespace-nowrap bg-white border-none text-accent-dark">
            Shop now
          </button>
        </div>
      </div>

      {/* spacer */}
      <div className="h-2" />
      <SectionDivider />

      {/* ── Shop by concern ────────────────────────────────────────────────── */}
      <section className="px-4 pt-6 pb-3" aria-labelledby="concern-heading">
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
      </section>

      <SectionDivider />

      {/* ── Trust strip ────────────────────────────────────────────────────── */}
      <section
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
      </section>

      <SectionDivider />
      <div className="h-2" />

      {/* ── Order tracking ─────────────────────────────────────────────────── */}
      <section
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
          <input
            type="text"
            // value={orderId}
            // onChange={(e) => {
            //   setOrderId(e.target.value)}
            // }}
            placeholder="Order ID · e.g. LUM-00847"
            className="flex-1 rounded-lg px-3 py-2 text-sm outline-none text-[13px] bg-surface-sunken text-deep border-[0.5px] border-drift font-(--font-mono,'JetBrains_Mono',monospace)"
            aria-label="Order ID"
          />
          <input
            type="tel"
            value={"phone"}
            // onChange={(e) => {
            //   // setPhone(e.target.value)
            // }}
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
      </section>

      <div className="h-2" />
    </main>
  );
}
