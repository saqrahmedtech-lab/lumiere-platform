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
    <section className="px-4 py-10 sm:py-12" aria-label={dict.label}>
      <div className="mx-auto max-w-7xl">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ">
          {BENEFITS.map(({ key, icon: Icon, color, bg }) => {
            const { title, description } = dict.items[key];
            return (
              <li
                key={key}
                className="flex items-center gap-4 py-4 first:pt-0 last:pb-0 sm:px-4 sm:py-0 lg:first:ps-0 lg:last:pe-0"
              >
                <span
                  className="flex size-11 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: bg, color }}
                >
                  <Icon size={20} strokeWidth={1.85} aria-hidden="true" />
                </span>

                <div className="min-w-0">
                  <p className="text-sm font-bold leading-tight text-deep">
                    {title}
                  </p>

                  <p className="mt-0.5 text-xs font-medium leading-tight text-text-secondary/75">
                    {description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default TrustStrip;
