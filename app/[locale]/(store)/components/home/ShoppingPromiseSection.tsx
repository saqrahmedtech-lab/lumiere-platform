import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  CheckCircle2,
  PackageCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";

import { getDictionary, type Dictionary } from "@/app/[locale]/dictionaries";
import { getLocale } from "@/lib/get-locale";

type StepKey = keyof Dictionary["home"]["shoppingPromise"]["steps"];
type PaymentKey = keyof Dictionary["home"]["shoppingPromise"]["payment"];

const STEPS: {
  key: StepKey;
  icon: typeof ShoppingBag;
  color: string;
  bg: string;
}[] = [
  {
    key: "choose",
    icon: ShoppingBag,
    color: "var(--color-tide)",
    bg: "var(--color-primary-light)",
  },
  {
    key: "order",
    icon: CheckCircle2,
    color: "var(--color-bloom)",
    bg: "var(--color-accent-light)",
  },
  {
    key: "receive",
    icon: Truck,
    color: "var(--color-drift)",
    bg: "var(--color-warning-light)",
  },
];

const PAYMENT_OPTIONS: {
  key: PaymentKey;
  icon: typeof Banknote;
}[] = [
  {
    key: "cod",
    icon: Banknote,
  },
  {
    key: "secureCheckout",
    icon: PackageCheck,
  },
];

async function ShoppingPromiseSection() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const shoppingPromise = dict.home.shoppingPromise;

  return (
    <section
      className="bg-surface px-4 py-16 sm:py-20"
      aria-labelledby="shopping-promise-heading"
    >
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-pearl p-6 shadow-sm sm:p-8">
          {/* Background atmosphere */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 12% 18%, rgba(168,213,209,0.42) 0%, transparent 32%),
                radial-gradient(circle at 88% 82%, rgba(232,113,90,0.18) 0%, transparent 34%),
                linear-gradient(135deg, var(--color-pearl) 0%, var(--color-surface-raised) 100%)
              `,
            }}
          />

          <div className="relative z-10">
            {/* Header */}
            <div className="mb-6 max-w-2xl">
              <p className="mb-3 inline-flex rounded-full bg-primary-light px-3 py-1.5 text-xs font-semibold text-tide">
                {shoppingPromise.badge}
              </p>

              <h2
                id="shopping-promise-heading"
                className="font-heading text-3xl font-bold leading-tight tracking-tight text-deep sm:text-4xl"
              >
                {shoppingPromise.title}
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-text-secondary/75 sm:text-base">
                {shoppingPromise.description}
              </p>
            </div>

            {/* Steps */}
            <div className="grid gap-3 lg:grid-cols-3">
              {STEPS.map(({ key, icon: Icon, color, bg }, index) => {
                const { title, description } = shoppingPromise.steps[key];
                return (
                  <div
                    key={key}
                    className="group relative overflow-hidden rounded-[1.5rem] border border-border/70 bg-pearl/80 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-drift/70 hover:shadow-md"
                  >
                    <div
                      aria-hidden="true"
                      className="absolute -end-12 -top-12 size-32 rounded-full opacity-45 blur-2xl transition-all duration-500 group-hover:scale-125 group-hover:opacity-70"
                      style={{ backgroundColor: bg }}
                    />

                    <div className="relative z-10">
                      <div className="mb-5 flex items-center justify-between">
                        <div
                          className="flex size-12 items-center justify-center rounded-2xl bg-surface-raised shadow-[inset_0_0_0_1px_rgba(196,168,130,0.25)]"
                          style={{ color }}
                        >
                          <Icon
                            size={23}
                            strokeWidth={1.8}
                            aria-hidden="true"
                          />
                        </div>

                        <span className="text-xs font-bold text-text-secondary/35">
                          0{index + 1}
                        </span>
                      </div>

                      <h3 className="text-base font-semibold text-deep">
                        {title}
                      </h3>

                      <p className="mt-2 text-sm leading-relaxed text-text-secondary/70">
                        {description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Payment promise row */}
            <div className="mt-4 flex flex-col gap-3 rounded-[1.5rem] border border-border/70 bg-surface-raised/70 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-3">
                {PAYMENT_OPTIONS.map(({ key, icon: Icon }) => (
                  <div
                    key={key}
                    className="flex items-center gap-2 text-sm font-medium text-deep/80"
                  >
                    <span className="flex size-8 items-center justify-center rounded-full bg-pearl text-tide">
                      <Icon size={16} strokeWidth={1.8} aria-hidden="true" />
                    </span>
                    {shoppingPromise.payment[key]}
                  </div>
                ))}
              </div>

              <Link
                href="/shop"
                className="group inline-flex h-10 items-center justify-center gap-2 rounded-full bg-tide px-4 text-sm font-semibold text-pearl no-underline shadow-sm transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tide/40"
              >
                {shoppingPromise.cta}
                <ArrowRight
                  size={15}
                  strokeWidth={2}
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ShoppingPromiseSection;
