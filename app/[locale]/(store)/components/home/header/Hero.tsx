import { Banknote, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { getLocale, isRTL } from "@/lib/i18n";
import heroImageLtr from "@/public/store/heroLeft.png";
import heroImageRtl from "@/public/store/heroRight.png";

const trustItems = [
  { icon: Truck, label: "Fast delivery" },
  { icon: ShieldCheck, label: "100% authentic" },
  { icon: Banknote, label: "Cash on delivery" },
];

async function Hero() {
  const locale = await getLocale();
  const isRtl = isRTL(locale);
  const heroImage = isRtl ? heroImageRtl : heroImageLtr;

  return (
    <section
      className="relative isolate overflow-hidden bg-tide text-primary-foreground"
      aria-labelledby="hero-heading"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_76%_45%,rgba(168,213,209,0.32),transparent_34%),linear-gradient(135deg,var(--tide),var(--deep))]"
      />

      <div
        aria-hidden="true"
        className="absolute inset-y-0 start-0 w-[62%] bg-gradient-to-r from-deep/50 via-deep/25 to-transparent rtl:bg-gradient-to-l"
      />

      <div className="relative mx-auto grid min-h-[560px] max-w-7xl grid-cols-1 items-center px-5 pt-14 lg:min-h-[620px] lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-0">
        <div className="relative z-20 max-w-xl">
          <p className="mb-5 text-xs font-medium uppercase tracking-wider text-seafoam">
            New arrivals · Summer 2026
          </p>

          <h1
            id="hero-heading"
            className="max-w-[11ch] font-heading text-4xl font-bold leading-tight tracking-tight text-pearl sm:text-5xl lg:text-6xl"
          >
            Beauty that <span className="text-seafoam">speaks</span> for itself
          </h1>

          <p className="mt-5 max-w-md text-base leading-relaxed text-pearl/75 sm:text-lg">
            Curated skincare, makeup and body care — delivered to your door
            across Egypt.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/${locale}/shop`}
              className="inline-flex h-12 items-center justify-center rounded-full bg-bloom px-7 text-sm font-semibold text-pearl shadow-sm transition hover:bg-accent-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pearl/80"
            >
              Shop now
            </Link>

            <Link
              href={`/${locale}/shop`}
              className="inline-flex h-12 items-center justify-center rounded-full border border-pearl/35 px-7 text-sm font-medium text-pearl transition hover:bg-pearl/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pearl/80"
            >
              View categories
            </Link>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-pearl/70">
            {trustItems.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2">
                <Icon
                  size={16}
                  className="text-seafoam"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none relative z-10 mt-10 h-[420px] self-end overflow-visible lg:mt-0 lg:h-[620px] lg:-me-20"
        >
          <Image
            key={isRtl ? "hero-rtl" : "hero-ltr"}
            src={heroImage}
            alt=""
            priority
            fill
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="object-contain object-bottom lg:object-right-bottom scale-[1.1] translate-y-8 lg:scale-[1.22] lg:translate-y-14 origin-bottom-right"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
