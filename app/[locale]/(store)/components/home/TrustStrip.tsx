import { Banknote, RotateCcw, ShieldCheck, Truck } from "lucide-react";

import { getDictionary, type Dictionary } from "@/app/[locale]/dictionaries";
import { getLocale } from "@/lib/get-locale";

type TrustKey = keyof Dictionary["home"]["trust"]["items"];

const BENEFITS: {
  key: TrustKey;
  icon: typeof Truck;
  color: string;
  bg: string;
}[] = [
  {
    key: "fastDelivery",
    icon: Truck,
    color: "var(--color-tide)",
    bg: "var(--color-primary-light)",
  },
  {
    key: "authentic",
    icon: ShieldCheck,
    color: "var(--color-bloom)",
    bg: "var(--color-accent-light)",
  },
  {
    key: "cod",
    icon: Banknote,
    color: "var(--color-primary-dark)",
    bg: "var(--color-primary-light)",
  },
  {
    key: "easyReturns",
    icon: RotateCcw,
    color: "var(--color-drift)",
    bg: "var(--color-warning-light)",
  },
];

async function TrustStrip() {
  const locale = await getLocale();
  const dict = (await getDictionary(locale)).home.trust;

  return (
    <section
      className="border-b border-border/60 bg-surface px-4 py-6"
      aria-label={dict.label}
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map(({ key, icon: Icon, color, bg }) => {
            const { title, description } = dict.items[key];
            return (
            <div
              key={key}
              className="group relative overflow-hidden rounded-[1.5rem] border border-border/70 bg-pearl p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-drift/70 hover:shadow-md"
            >
              {/* Gradient background */}
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-75 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background: `
                    radial-gradient(circle at 88% 18%, ${color}26 0%, transparent 32%),
                    linear-gradient(135deg, ${bg} 0%, var(--color-pearl) 58%, var(--color-surface-raised) 100%)
                  `,
                }}
              />

              {/* Icon glow */}
              <div
                aria-hidden="true"
                className="absolute -start-8 -top-8 size-28 rounded-full opacity-45 blur-2xl transition-all duration-300 group-hover:scale-125 group-hover:opacity-70"
                style={{ backgroundColor: color }}
              />

              <div className="relative flex items-center gap-4">
                <div
                  className="flex size-13 shrink-0 items-center justify-center rounded-[1.15rem] bg-pearl/80 shadow-[inset_0_0_0_1px_rgba(196,168,130,0.28)] backdrop-blur-sm transition-transform duration-300 group-hover:scale-105"
                  style={{ color }}
                >
                  <Icon size={24} strokeWidth={1.85} aria-hidden="true" />
                </div>

                <div className="min-w-0">
                  <p className="text-[15px] font-bold leading-tight text-deep">
                    {title}
                  </p>

                  <p className="mt-1 text-[13px] font-medium leading-tight text-text-secondary/75">
                    {description}
                  </p>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default TrustStrip;
