import Link from "next/link";
import { ArrowRight, Truck } from "lucide-react";

import { getDictionary } from "@/app/[locale]/dictionaries";
import { getLocale } from "@/lib/get-locale";

async function PromotionBanner() {
  const locale = await getLocale();
  const dict = (await getDictionary(locale)).home.promo;

  return (
    <section aria-label="Promotion">
      <div className="group relative overflow-hidden border border-bloom/15 bg-bloom shadow-sm">
        {/* Softer gradient layer */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 88% 18%, rgba(249, 246, 240, 0.22), transparent 34%),
              radial-gradient(circle at 12% 90%, rgba(196, 80, 60, 0.28), transparent 42%),
              linear-gradient(135deg, var(--color-bloom) 0%, color-mix(in srgb, var(--color-bloom) 86%, var(--color-deep)) 100%)
            `,
          }}
        />

        {/* Soft pattern */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.12]"
          style={{
            background:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.55) 0 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />

        {/* Glow */}
        <div
          aria-hidden="true"
          className="absolute -end-16 -top-16 size-40 rounded-full bg-pearl/18 blur-3xl transition-transform duration-500 group-hover:scale-125"
        />

        <div className="container mx-auto relative z-10 flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
          <div className="flex gap-3.5">
            {/* Icon */}
            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-pearl/16 text-pearl shadow-[inset_0_0_0_1px_rgba(255,255,255,0.16)] backdrop-blur-sm sm:size-11">
              <Truck size={21} strokeWidth={1.8} aria-hidden="true" />
            </div>

            {/* Text */}
            <div>
              <p className="mb-1.5 inline-flex rounded-full bg-pearl/14 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-pearl/80">
                {dict.badge}
              </p>

              <h2 className="max-w-xl text-lg font-bold leading-tight text-pearl sm:text-xl">
                {dict.titlePrefix}{" "}
                <span className="whitespace-nowrap">{dict.amount}</span>
              </h2>

              <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-pearl/75 sm:text-sm">
                {dict.description}
              </p>
            </div>
          </div>

          {/* CTA */}
          <Link
            href={`/${locale}/shop`}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-pearl px-4 text-xs font-semibold text-accent-dark no-underline shadow-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pearl/70 sm:px-5 sm:text-sm"
          >
            {dict.cta}
            <ArrowRight
              size={14}
              strokeWidth={2}
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default PromotionBanner;
