import { Banknote, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { getDictionary } from "@/app/[locale]/dictionaries";
import { getLocale } from "@/lib/get-locale";
import { isRTL } from "@/lib/i18n";
import heroImageLtr from "@/public/store/heroLeft.png";
import heroImageRtl from "@/public/store/heroRight.png";

async function Hero() {
  const locale = await getLocale();
  const dict = (await getDictionary(locale)).home.hero;
  const isRtl = isRTL(locale);
  const heroImage = isRtl ? heroImageRtl : heroImageLtr;

  const trustItems = [
    { icon: Truck, label: dict.trust.fastDelivery },
    { icon: ShieldCheck, label: dict.trust.authentic },
    { icon: Banknote, label: dict.trust.cod },
  ];

  return (
    <section
      className="relative isolate overflow-hidden bg-tide text-primary-foreground"
      aria-labelledby="hero-heading"
    >
      {/* Background atmosphere */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_75%_45%,rgba(168,213,209,0.30),transparent_34%),linear-gradient(135deg,var(--tide),var(--deep))]"
      />

      {/* Mobile image */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 end-[-90px] z-0 h-[390px] w-[430px] opacity-35 sm:end-[-40px] sm:h-[460px] sm:w-[520px] lg:hidden"
      >
        <Image
          key={isRtl ? "hero-mobile-rtl" : "hero-mobile-ltr"}
          src={heroImage}
          alt=""
          priority
          fill
          sizes="520px"
          className="object-contain object-bottom"
        />
      </div>

      {/* Mobile dark overlay over image for readability */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[1] bg-gradient-to-b from-deep/35 via-deep/25 to-deep/50 lg:hidden"
      />

      {/* Desktop text-side depth */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 start-0 hidden w-[62%] bg-gradient-to-r from-deep/50 via-deep/25 to-transparent lg:block rtl:bg-gradient-to-l"
      />

      <div className="relative z-10 mx-auto min-h-[620px] max-w-7xl px-5 py-16 sm:min-h-[680px] sm:px-6 lg:min-h-[620px] lg:px-8 lg:py-0">
        {/* Content */}
        <div className="flex min-h-[520px] max-w-xl flex-col justify-center sm:min-h-[560px] lg:min-h-[620px] lg:max-w-[48%]">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-seafoam/90">
            {dict.badge}
          </p>

          <h1
            id="hero-heading"
            className="max-w-[10.5ch] font-heading text-[3rem] font-bold leading-[0.98] tracking-tight text-pearl sm:text-6xl lg:text-6xl"
          >
            {dict.titleStart}{" "}
            <span className="text-seafoam">{dict.titleHighlight}</span>{" "}
            {dict.titleEnd}
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-pearl/75 sm:text-lg">
            {dict.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/${locale}/shop`}
              className="inline-flex h-12 items-center justify-center rounded-full bg-bloom px-7 text-sm font-semibold text-pearl shadow-sm transition hover:bg-accent-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pearl/80"
            >
              {dict.shopNow}
            </Link>

            <Link
              href={`/${locale}/shop`}
              className="inline-flex h-12 items-center justify-center rounded-full border border-pearl/35 px-7 text-sm font-medium text-pearl transition hover:bg-pearl/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pearl/80"
            >
              {dict.viewCategories}
            </Link>
          </div>

          <ul className="mt-8 grid gap-3 text-sm text-pearl/70 sm:flex sm:flex-wrap sm:gap-x-6 sm:gap-y-3">
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

        {/* Desktop image */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 end-8 z-10 hidden h-[620px] w-[58%] overflow-visible lg:block"
        >
          <Image
            key={isRtl ? "hero-desktop-rtl" : "hero-desktop-ltr"}
            src={heroImage}
            alt=""
            priority
            fill
            sizes="58vw"
            className="object-contain object-right-bottom scale-[1.16] translate-y-8 origin-bottom-right"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
