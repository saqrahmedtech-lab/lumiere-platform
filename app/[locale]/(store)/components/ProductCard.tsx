import { Heart, ShoppingBag } from "lucide-react";
import { Product } from "../types/store.types";
import Image from "next/image";
import Link from "next/link";
import { slugify } from "@/lib/utils";
import { getDictionary } from "@/app/[locale]/dictionaries";
import { getLocale } from "@/lib/get-locale";

export async function ProductCard({
  badge,
  badgeBg,
  imgBg,
  image,
  category,
  name,
  sub,
  price,
  slug,
  id,
}: Product) {
  const locale = await getLocale();
  const dict = (await getDictionary(locale)).store;

  const detailsHref = `/${locale}/shop/product/${slug ?? slugify(name)}-${id}`;

  return (
    <article className="group relative overflow-hidden rounded-[1.6rem] border border-border/70 bg-pearl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-drift/70 hover:shadow-lg">
      {/* Main product link */}
      <Link
        href={detailsHref}
        aria-label={dict.viewDetails.replace("{name}", name)}
        className="block no-underline"
      >
        {badge && (
          <span
            className="absolute start-3 top-3 z-20 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-white shadow-sm"
            style={{ background: badgeBg ?? "var(--color-bloom)" }}
          >
            {badge}
          </span>
        )}

        <div className="relative h-44 overflow-hidden sm:h-52">
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 70% 20%, rgba(255,255,255,0.75) 0%, transparent 34%),
                linear-gradient(135deg, ${imgBg}, var(--color-pearl) 82%)
              `,
            }}
          />

          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 size-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pearl/80 opacity-60 blur-2xl transition-all duration-500 group-hover:scale-125 group-hover:opacity-90"
          />

          <div className="relative z-10 flex h-full items-center justify-center px-5 pt-5 transition-transform duration-500 group-hover:scale-105">
            <Image
              src={image}
              alt={name}
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-contain object-center p-5 drop-shadow-md"
            />
          </div>

          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-pearl to-transparent"
          />
        </div>

        <div className="px-4 pb-[4.75rem] pt-3">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-tide">
            {category}
          </p>

          <h3 className="line-clamp-1 text-sm font-semibold text-deep">
            {name}
          </h3>

          <p className="mt-1 line-clamp-1 text-xs text-text-secondary/70">
            {sub}
          </p>

          <div className="mt-4">
            <p className="text-[10px] font-medium text-text-secondary/60">
              {dict.price}
            </p>

            <p className="text-base font-bold leading-none text-deep">
              {price}
              <span className="ms-1 text-[11px] font-medium text-text-secondary/65">
                {dict.currency}
              </span>
            </p>
          </div>
        </div>
      </Link>

      {/* Wishlist button */}
      <button
        type="button"
        aria-label={dict.addToWishlist}
        className="absolute end-3 top-3 z-30 flex size-8 cursor-pointer items-center justify-center rounded-full bg-pearl/85 text-deep/70 shadow-sm backdrop-blur-sm transition hover:bg-pearl hover:text-bloom focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bloom/35"
      >
        <Heart size={15} strokeWidth={1.8} aria-hidden="true" />
      </button>

      {/* Add button */}
      <button
        type="button"
        aria-label={dict.addToCart ?? dict.add}
        className="absolute bottom-4 end-4 z-30 inline-flex h-10 min-w-20 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-bloom px-4 text-xs font-bold text-pearl shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-dark hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bloom/45 focus-visible:ring-offset-2 focus-visible:ring-offset-pearl sm:min-w-28 sm:px-5"
      >
        <ShoppingBag size={15} strokeWidth={2} aria-hidden="true" />

        <span className="sm:hidden">{dict.add}</span>
        <span className="hidden sm:inline">
          {dict.addToCart ?? "Add to cart"}
        </span>
      </button>
    </article>
  );
}
