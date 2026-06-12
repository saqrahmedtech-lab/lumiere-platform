import { Search, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
const NAV_LINKS = [
  "Shop",
  "Skincare",
  "Makeup",
  "Sun care",
  "Body care",
] as const;
function Navbar() {
  return (
    <nav
      className=" px-5 py-3 sticky top-0 z-50 bg-pearl border-b-[0.5px] border-b-[color-mix(in_srgb,var(--color-drift)_40%,transparent)]"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-between container mx-auto">
        <Link
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
                href={`/shop/${link.toLowerCase().replace(" ", "-")}`}
                key={link}
                aria-label="Lumière — go to homepage"
                className="text-sm no-underline text-text-secondary"
              >
                {link}
              </Link>
            );
          })}
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
      </div>
    </nav>
  );
}

export default Navbar;
