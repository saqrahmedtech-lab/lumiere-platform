"use client";

import { Search, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import type { Dictionary } from "@/app/[locale]/dictionaries";
import { useLocale } from "@/hooks/use-locale";

const NAV_LINKS = [
  { slug: "shop", key: "shop" },
  { slug: "skincare", key: "skincare" },
  { slug: "makeup", key: "makeup" },
  { slug: "sun-care", key: "sunCare" },
  { slug: "body-care", key: "bodyCare" },
] as const;

function Navbar({ dict }: { dict: Dictionary["home"]["nav"] }) {
  const locale = useLocale();
  const pathname = usePathname();

  const targetLocale = locale === "ar" ? "en" : "ar";
  const segments = pathname.split("/");
  segments[1] = targetLocale;
  const targetPath = segments.join("/") || `/${targetLocale}`;

  const cartCount = 2;

  return (
    <nav
      className=" px-5 py-3 sticky top-0 z-50 bg-pearl border-b-[0.5px] border-b-[color-mix(in_srgb,var(--color-drift)_40%,transparent)]"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-between container mx-auto">
        <Link
          dir="ltr"
          href="/"
          aria-label="Lumière — go to homepage"
          className="font-bold tracking-[-0.02em] no-underline text-md text-tide "
        >
          Lumière<span className="text-bloom">.</span>
        </Link>

        {/* Links — hidden on small screens in a real impl */}
        <div className="hidden md:flex items-center gap-4">
          {NAV_LINKS.map((link) => {
            return (
              <Link
                href={`/shop/${link.slug}`}
                key={link.slug}
                className="text-sm no-underline text-text-secondary"
              >
                {dict.categories[link.key]}
              </Link>
            );
          })}
        </div>

        {/* Icons */}
        <div className="flex items-center gap-3">
          <Link
            href={targetPath}
            lang={targetLocale}
            className="rounded-full px-3 py-0.5 text-xs font-medium cursor-pointer no-underline bg-transparent text-[11px] text-tide border-[0.5px] border-tide"
            aria-label={
              targetLocale === "ar" ? dict.switchToArabic : dict.switchToEnglish
            }
          >
            {targetLocale === "ar" ? "ع" : "EN"}
          </Link>
          <button
            className="p-1 cursor-pointer bg-transparent border-none"
            aria-label={dict.search}
          >
            <Search size={18} color="var(--color-text-secondary)" />
          </button>
          <Link
            href="/cart"
            className="relative p-1"
            aria-label={dict.cart.replace("{count}", String(cartCount))}
          >
            <ShoppingBag size={18} color="var(--color-text-secondary)" />
            {cartCount > 0 && (
              <span
                className="absolute -top-1 -right-1 flex items-center justify-center text-white rounded-full w-3.5 h-3.5 text-[9px] font-bold bg-bloom"
                aria-hidden="true"
              >
                {cartCount}
              </span>
            )}
          </Link>
          <Link
            href="/account"
            aria-label={dict.account}
            className="p-1 cursor-pointer bg-transparent border-none"
          >
            <User size={18} color="var(--color-text-secondary)" />
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
