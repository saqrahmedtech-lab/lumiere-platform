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
      className="group relative min-h-[170px] overflow-hidden rounded-[1.75rem] border border-border/70 bg-pearl p-5 no-underline shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-drift/70 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tide/40"
    >
      {/* Gradient background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-95"
        style={{
          background: `
            radial-gradient(circle at 88% 22%, ${color}40 0%, transparent 34%),
            radial-gradient(circle at 18% 90%, ${bg} 0%, transparent 44%),
            linear-gradient(135deg, ${bg} 0%, var(--color-pearl) 52%, var(--color-surface-raised) 100%)
          `,
        }}
      />

      {/* Image glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -end-10 bottom-1 z-[1] h-[86%] w-[68%] rounded-full opacity-55 blur-2xl transition-all duration-500 group-hover:scale-110 group-hover:opacity-80"
        style={{
          background: `
            radial-gradient(circle at 55% 55%, ${color}80 0%, ${color}38 34%, transparent 72%)
          `,
        }}
      />

      {/* Secondary soft glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute end-2 top-8 z-[1] h-24 w-24 rounded-full opacity-35 blur-xl transition-all duration-500 group-hover:opacity-55"
        style={{ backgroundColor: color }}
      />

      {/* Category image */}
      <div className="pointer-events-none absolute -end-5 bottom-0 top-3 z-[2] w-[58%] transition-transform duration-500 group-hover:scale-105">
        <Image
          src={image}
          alt=""
          fill
          sizes="(min-width: 1024px) 15vw, 45vw"
          className="object-contain object-bottom opacity-95 drop-shadow-md"
        />
      </div>

      {/* Readability overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[3] bg-gradient-to-r from-pearl/95 via-pearl/72 to-transparent rtl:bg-gradient-to-l"
      />

      <div className="relative z-10 flex h-full min-h-[130px] flex-col justify-between">
        {/* Icon badge */}
        <div
          className="flex size-11 items-center justify-center rounded-2xl bg-pearl/85 shadow-[inset_0_0_0_1px_rgba(196,168,130,0.25)] backdrop-blur-sm transition-transform duration-300 group-hover:scale-105"
          style={{ color }}
        >
          <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
        </div>

        <div className="max-w-[62%]">
          <p className="text-sm font-semibold text-deep">{label}</p>

          <p className="mt-1 text-xs font-medium text-text-secondary/75">
            {productsLabel}
          </p>

          <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-tide opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100 rtl:group-hover:-translate-x-0.5">
            {shopNowLabel}
            <ArrowUpRight
              size={14}
              strokeWidth={2}
              aria-hidden="true"
              className="rtl:rotate-[-90deg]"
            />
          </div>
        </div>
      </div>

      {/* Bottom accent */}
      <span
        aria-hidden="true"
        className="absolute inset-x-5 bottom-0 z-10 h-0.5 scale-x-0 rounded-full transition-transform duration-300 group-hover:scale-x-100"
        style={{ backgroundColor: color }}
      />
    </Link>
  );
}

export default CategoryCard;
