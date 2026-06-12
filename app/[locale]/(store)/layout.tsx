import {
  Truck,
  ShieldCheck,
  Banknote,
  Search,
  ShoppingBag,
  User,
} from "lucide-react";
import { WaveDivider } from "./components/WaveDivider";
import Footer from "@/app/[locale]/(store)/components/Footer";
import Link from "next/link";
const FOOTER_LINKS = [
  "Shop",
  "About us",
  "Track order",
  "Contact",
  "Return policy",
  "Merchant login",
] as const;

const NAV_LINKS = ["Shop", "Skincare", "Makeup", "Sun care", "Body care"];

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav
        className="flex items-center justify-between px-5 py-3 sticky top-0 z-50 bg-pearl border-b-[0.5px] border-b-[color-mix(in_srgb,var(--color-drift)_40%,transparent)]"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          aria-label="Lumière — go to homepage"
          className="font-bold tracking-[-0.02em] no-underline text-[18px] text-tide "
        >
          Lumière<span className="text-bloom">.</span>
        </Link>

        {/* Links — hidden on small screens in a real impl */}
        <div className="hidden md:flex items-center gap-4">
          {NAV_LINKS.map((link) => (
            <Link
              href={`/shop/${link.toLowerCase().replace(" ", "-")}`}
              key={link}
              aria-label="Lumière — go to homepage"
              className="text-sm no-underline text-text-secondary"
            >
              {link}
            </Link>
          ))}
        </div>

        {/* Icons */}
        <div className="flex items-center gap-3">
          <button
            className="rounded-full px-3 py-0.5 text-xs font-medium cursor-pointer bg-transparent text-[11px] text-tide border-[0.5px] border-tide"
            aria-label="Switch to Arabic"
          >
            ع
          </button>
          <button
            className="p-1 cursor-pointer bg-transparent border-none"
            aria-label="Search"
          >
            <Search size={18} color="var(--color-text-secondary)" />
          </button>
          <Link
            href="/cart"
            className="relative p-1"
            aria-label={`Cart — 2 items`}
          >
            <ShoppingBag size={18} color="var(--color-text-secondary)" />
            {2 > 0 && (
              <span
                className="absolute -top-1 -right-1 flex items-center justify-center text-white rounded-full w-3.5 h-3.5 text-[9px] font-bold bg-bloom"
                aria-hidden="true"
              >
                {2}
              </span>
            )}
          </Link>
          <Link
            href="/account"
            aria-label="Account"
            className="p-1 cursor-pointer bg-transparent border-none"
          >
            <User size={18} color="var(--color-text-secondary)" />
          </Link>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section
        className="flex flex-col gap-4 px-5 pt-10 pb-0 bg-tide"
        aria-labelledby="hero-heading"
      >
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-seafoam">
            New arrivals · Summer 2026
          </p>

          <h1
            id="hero-heading"
            className="font-bold text-white leading-[1.2] text-[30px] max-w-85"
          >
            Beauty that <em className="not-italic text-seafoam">speaks</em> for
            itself
          </h1>

          <p className="text-sm leading-relaxed max-w-[320px] text-[rgba(255,255,255,0.75)]">
            Curated skincare, makeup and body care — delivered to your door
            across Egypt.
          </p>

          <div className="flex gap-2.5 flex-wrap mt-1">
            <Link
              href="/shop"
              className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white cursor-pointer no-underline border-none bg-bloom"
            >
              Shop now
            </Link>
            <Link
              href="/shop"
              className="rounded-xl px-5 py-2.5 text-sm cursor-pointer no-underline bg-transparent text-white border border-[rgba(255,255,255,0.4)]"
            >
              View categories
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex gap-4 flex-wrap mt-1 pb-6">
            {[
              { icon: Truck, label: "Fast delivery" },
              { icon: ShieldCheck, label: "100% authentic" },
              { icon: Banknote, label: "Cash on delivery" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 text-xs text-[rgba(255,255,255,0.70)]"
              >
                <Icon
                  size={14}
                  color="var(--color-seafoam)"
                  aria-hidden="true"
                />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Wave break out of hero */}
        <WaveDivider />
      </section>
      <main className="flex-1">{children}</main>
      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <Footer links={FOOTER_LINKS} />
    </>
  );
}
