import { ArrowRight, Mail, Sparkles } from "lucide-react";

function NewsletterSection() {
  return (
    <section
      className="bg-surface px-4 py-10"
      aria-labelledby="newsletter-heading"
    >
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-deep p-6 text-pearl shadow-sm sm:p-8 lg:p-10">
          {/* Background atmosphere */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 16% 18%, rgba(168,213,209,0.28) 0%, transparent 34%),
                radial-gradient(circle at 90% 72%, rgba(232,113,90,0.24) 0%, transparent 36%),
                linear-gradient(135deg, var(--color-deep) 0%, #10262d 100%)
              `,
            }}
          />

          {/* Soft pattern */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.13]"
            style={{
              background:
                "radial-gradient(circle at center, rgba(255,255,255,0.55) 0 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />

          <div className="relative z-10 grid gap-7 lg:grid-cols-[1fr_0.95fr] lg:items-center">
            {/* Text */}
            <div className="max-w-xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-pearl/10 bg-pearl/10 px-3 py-1.5 text-xs font-semibold text-seafoam">
                <Sparkles size={14} strokeWidth={1.8} aria-hidden="true" />
                Lumière updates
              </div>

              <h2
                id="newsletter-heading"
                className="font-heading text-3xl font-bold leading-tight tracking-tight text-pearl sm:text-4xl"
              >
                Get glow updates.
              </h2>

              <p className="mt-3 max-w-lg text-sm leading-relaxed text-pearl/70 sm:text-base">
                New arrivals, exclusive offers, and beauty tips delivered to
                your inbox.
              </p>
            </div>

            {/* Form */}
            <form className="relative">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>

              <div className="flex flex-col gap-3 rounded-[1.5rem] border border-pearl/10 bg-pearl/10 p-3 backdrop-blur-sm sm:flex-row sm:items-center">
                <div className="flex min-w-0 flex-1 items-center gap-3 rounded-full bg-pearl px-4">
                  <Mail
                    size={17}
                    strokeWidth={1.8}
                    className="shrink-0 text-tide"
                    aria-hidden="true"
                  />

                  <input
                    id="newsletter-email"
                    name="email"
                    type="email"
                    required
                    placeholder="Enter your email"
                    className="h-12 min-w-0 flex-1 border-0 bg-transparent text-sm text-deep outline-none placeholder:text-text-secondary/55"
                  />
                </div>

                <button
                  type="submit"
                  className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-bloom px-6 text-sm font-semibold text-pearl shadow-sm transition hover:bg-accent-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pearl/70"
                >
                  Subscribe
                  <ArrowRight
                    size={15}
                    strokeWidth={2}
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                  />
                </button>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-pearl/45">
                No spam. Unsubscribe anytime.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NewsletterSection;
