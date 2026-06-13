import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

import storyImage from "@/public/store/heroLeft.png";

const POINTS = [
  "Curated skincare, makeup and body care",
  "Chosen for everyday glow",
  "Delivered across Egypt",
];

function BrandStorySection() {
  return (
    <section
      className="bg-surface px-4 py-12"
      aria-labelledby="brand-story-heading"
    >
      <div className="mx-auto container">
        <div className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-pearl shadow-sm">
          {/* Background atmosphere */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 18% 20%, rgba(168,213,209,0.42) 0%, transparent 32%),
                radial-gradient(circle at 86% 72%, rgba(232,113,90,0.20) 0%, transparent 34%),
                linear-gradient(135deg, var(--color-pearl) 0%, var(--color-surface-raised) 100%)
              `,
            }}
          />

          <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:p-10">
            {/* Text */}
            <div className="relative z-10 max-w-xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-tide/15 bg-primary-light/70 px-3 py-1.5 text-xs font-semibold text-tide">
                <Sparkles size={14} strokeWidth={1.8} aria-hidden="true" />
                Why Lumière
              </div>

              <h2
                id="brand-story-heading"
                className="font-heading text-3xl font-bold leading-tight tracking-tight text-deep sm:text-4xl"
              >
                Beauty, curated with care.
              </h2>

              <p className="mt-4 text-base leading-relaxed text-text-secondary sm:text-lg">
                Lumière brings together skincare, makeup, and body care
                essentials chosen for everyday glow — from trusted beauty names
                to fresh seasonal picks, delivered across Egypt.
              </p>

              <div className="mt-6 grid gap-3">
                {POINTS.map((point) => (
                  <div key={point} className="flex items-center gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-light text-tide">
                      <CheckCircle2
                        size={15}
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                    </span>

                    <span className="text-sm font-medium text-deep/80">
                      {point}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link
                  href="/about"
                  className="group inline-flex h-11 items-center justify-center gap-2 rounded-full bg-tide px-5 text-sm font-semibold text-pearl no-underline shadow-sm transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tide/40"
                >
                  Learn more
                  <ArrowRight
                    size={15}
                    strokeWidth={2}
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                  />
                </Link>
              </div>
            </div>

            {/* Visual */}
            <div className="relative z-10">
              <div className="relative mx-auto aspect-[4/5] max-h-[460px] max-w-sm overflow-hidden rounded-[1.7rem] bg-surface shadow-[0_24px_70px_rgba(26,46,53,0.14)] lg:ms-auto">
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    background: `
                      radial-gradient(circle at 72% 18%, rgba(232,113,90,0.24) 0%, transparent 35%),
                      linear-gradient(135deg, var(--color-primary-light), var(--color-pearl) 70%)
                    `,
                  }}
                />

                <div
                  aria-hidden="true"
                  className="absolute -end-12 -top-12 size-44 rounded-full bg-bloom/20 blur-3xl"
                />

                <Image
                  src={storyImage}
                  alt="Lumière curated beauty products"
                  fill
                  sizes="(min-width: 1024px) 36vw, 90vw"
                  className="object-cover"
                />

                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-deep/35 to-transparent"
                />

                <div className="absolute bottom-4 start-4 rounded-2xl bg-pearl/88 px-4 py-3 shadow-sm backdrop-blur-md">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-tide">
                    Curated picks
                  </p>
                  <p className="mt-1 text-sm font-semibold text-deep">
                    For your everyday glow
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BrandStorySection;
