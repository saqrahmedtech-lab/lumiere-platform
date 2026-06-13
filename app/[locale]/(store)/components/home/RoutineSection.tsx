import { ArrowRight, Check, Sparkles } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

import { getDictionary, type Dictionary } from "@/app/[locale]/dictionaries";
import { getLocale } from "@/lib/get-locale";

type ProductKey = keyof Dictionary["home"]["routine"]["products"];

type RoutineProduct = {
  id: number | string;
  key: ProductKey;
  price: number;
  image: StaticImageData | string;
  href: string;
};

const ROUTINE_PRODUCTS: RoutineProduct[] = [
  {
    id: 1,
    key: "cleanse",
    price: 280,
    image: "/store/heroLeft.png",
    href: "/shop/product/rose-water-glow-toner-1",
  },
  {
    id: 2,
    key: "treat",
    price: 420,
    image: "/store/heroLeft.png",
    href: "/shop/product/hydra-glow-serum-2",
  },
  {
    id: 3,
    key: "protect",
    price: 390,
    image: "/store/heroLeft.png",
    href: "/shop/product/aqua-light-spf50-3",
  },
];

function RoutineProductCard({
  product,
  currency,
}: {
  product: RoutineProduct & {
    step: string;
    name: string;
    description: string;
  };
  currency: string;
}) {
  return (
    <Link
      href={product.href}
      className="group relative overflow-hidden rounded-[1.4rem] border border-border/70 bg-pearl p-3 no-underline shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-drift/70 hover:shadow-md"
    >
      <div className="relative mb-3 h-28 overflow-hidden rounded-[1rem] bg-surface-raised">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(168,213,209,0.55),transparent_36%),linear-gradient(135deg,var(--color-primary-light),var(--color-pearl))]"
        />

        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 12vw, 45vw"
          className="object-contain p-4 drop-shadow-sm transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-tide">
        {product.step}
      </p>

      <h3 className="mt-1 line-clamp-1 text-sm font-semibold text-deep">
        {product.name}
      </h3>

      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-text-secondary/75">
        {product.description}
      </p>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-sm font-bold text-deep">
          {product.price}
          <span className="ms-1 text-[11px] font-medium text-text-secondary/65">
            {currency}
          </span>
        </p>

        <span className="inline-flex size-7 items-center justify-center rounded-full bg-primary-light text-tide transition group-hover:bg-tide group-hover:text-pearl">
          <ArrowRight
            size={14}
            strokeWidth={2}
            aria-hidden="true"
            className="rtl:rotate-180"
          />
        </span>
      </div>
    </Link>
  );
}

export async function RoutineSection() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const routine = dict.home.routine;
  const currency = dict.store.currency;

  const total = ROUTINE_PRODUCTS.reduce((sum, item) => sum + item.price, 0);
  const benefits = Object.values(routine.benefits);

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-pearl p-4 shadow-sm sm:p-5 lg:p-6">
      {/* Background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_90%_20%,rgba(232,113,90,0.16),transparent_34%),radial-gradient(circle_at_12%_85%,rgba(168,213,209,0.45),transparent_36%)]"
      />

      <div className="relative grid gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        {/* Left editorial content */}
        <div className="rounded-[1.5rem] bg-surface-raised/70 p-5">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-pearl px-3 py-1.5 text-[11px] font-semibold text-tide shadow-sm">
            <Sparkles size={13} aria-hidden="true" />
            {routine.badge}
          </div>

          <h3 className="max-w-md font-heading text-3xl font-bold leading-tight text-deep sm:text-4xl">
            {routine.title}
          </h3>

          <p className="mt-3 max-w-md text-sm leading-relaxed text-text-secondary">
            {routine.description}
          </p>

          <ul className="mt-5 grid gap-2 text-sm text-text-secondary">
            {benefits.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="inline-flex size-5 items-center justify-center rounded-full bg-primary-light text-tide">
                  <Check size={12} strokeWidth={2.2} aria-hidden="true" />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/shop/routines/morning-glow"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-tide px-5 text-sm font-semibold text-pearl no-underline shadow-sm transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tide/40"
            >
              {routine.cta}
              <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
            </Link>

            <p className="text-sm font-medium text-text-secondary">
              {routine.totalFrom}{" "}
              <span className="font-bold text-deep">
                {total} {currency}
              </span>
            </p>
          </div>
        </div>

        {/* Right products */}
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          {ROUTINE_PRODUCTS.map((product) => (
            <RoutineProductCard
              key={product.id}
              product={{ ...product, ...routine.products[product.key] }}
              currency={currency}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
