import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

type CategoryCardProps = {
  icon: LucideIcon;
  slug: string;
  label: string;
  productsLabel: string;
  shopNowLabel: string;
  color: string;
  bg: string;
  image: StaticImageData | string;
};

function CategoryCard({
  icon: Icon,
  slug,
  label,
  productsLabel,
  shopNowLabel,
  color,
  bg,
  image,
}: CategoryCardProps) {
  return (
    <Link
      href={`/shop/${slug}`}
      aria-label={label}
      className="group relative min-h-[220px] overflow-hidden rounded-[1.75rem] border border-border/70 bg-pearl p-5 no-underline shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-drift/70 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tide/40 sm:min-h-[235px]"
    >
      {/* Rich gradient background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-95"
        style={{
          background: `
            radial-gradient(circle at 84% 18%, ${color}45 0%, transparent 32%),
            radial-gradient(circle at 92% 88%, ${color}30 0%, transparent 35%),
            linear-gradient(135deg, ${bg} 0%, var(--color-pearl) 44%, var(--color-surface-raised) 100%)
          `,
        }}
      />

      {/* Big soft image glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -end-14 bottom-0 z-[1] h-[92%] w-[78%] rounded-full opacity-60 blur-3xl transition-all duration-500 group-hover:scale-110 group-hover:opacity-85"
        style={{
          background: `radial-gradient(circle, ${color}75 0%, ${color}28 42%, transparent 72%)`,
        }}
      />

      {/* Category image */}
      <div className="pointer-events-none absolute -end-8 bottom-0 top-6 z-[2] w-[74%] transition-transform duration-500 group-hover:scale-105">
        <Image
          src={image}
          alt=""
          fill
          sizes="(min-width: 1024px) 22vw, 70vw"
          className="object-contain object-bottom drop-shadow-xl"
        />
      </div>

      {/* Stronger readability overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[3] bg-gradient-to-r from-pearl via-pearl/88 via-42% to-pearl/10 rtl:bg-gradient-to-l"
      />

      {/* Subtle top shine */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 z-[4] h-px bg-white/70"
      />

      <div className="relative z-10 flex h-full min-h-[180px] flex-col justify-between">
        {/* Bottom content */}
        <div className="max-w-[68%]">
          <h3 className="mt-1 text-lg font-bold tracking-[-0.02em] text-deep">
            {label}
          </h3>
          <span
            className="rounded-full px-2.5 py-1 text-[10px] font-semibold text-deep/70 shadow-sm backdrop-blur-sm"
            style={{ backgroundColor: bg }}
          >
            {productsLabel}
          </span>

          <p className="mt-2 max-w-[10rem] text-xs leading-relaxed text-text-secondary/75">
            Explore curated {label.toLowerCase()} picks for your daily beauty
            routine.
          </p>

          <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-tide transition-all duration-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5">
            {shopNowLabel}
            <span
              className="inline-flex size-6 items-center justify-center rounded-full text-pearl transition-transform duration-300 group-hover:scale-110"
              style={{ backgroundColor: color }}
            >
              <ArrowUpRight
                size={13}
                strokeWidth={2}
                aria-hidden="true"
                className="rtl:rotate-[-90deg]"
              />
            </span>
          </div>
        </div>
      </div>

      {/* Bottom accent */}
      <span
        aria-hidden="true"
        className="absolute inset-x-6 bottom-0 z-10 h-0.5 scale-x-0 rounded-full transition-transform duration-300 group-hover:scale-x-100"
        style={{ backgroundColor: color }}
      />
    </Link>
  );
}

export default CategoryCard;
