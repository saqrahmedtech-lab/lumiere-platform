import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import { StoreLinks } from "../types/store.types";
import { getDictionary } from "@/app/[locale]/dictionaries";
import { getLocale } from "@/lib/get-locale";

async function Footer({ links }: { links: StoreLinks }) {
  const locale = await getLocale();
  const footer = (await getDictionary(locale)).footer;

  return (
    <footer
      className="relative overflow-hidden bg-deep px-4 pb-6 pt-10 text-pearl"
      aria-label={footer.ariaLabel}
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="absolute -start-20 -top-20 size-56 rounded-full bg-tide/25 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="absolute -end-24 bottom-0 size-60 rounded-full bg-bloom/20 blur-3xl"
      />

      <div className="relative mx-auto container">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          {/* Brand */}
          <div>
            <Link
              href="/"
              dir="ltr"
              aria-label={footer.homeAriaLabel}
              className="inline-flex items-center text-xl font-bold tracking-[-0.02em] text-pearl no-underline"
            >
              Lumière<span className="text-bloom">.</span>
            </Link>

            <p className="mt-3 max-w-sm text-sm leading-relaxed text-pearl/60">
              {footer.description}
            </p>

            <div className="mt-5 grid gap-2 text-sm text-pearl/60">
              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-seafoam" aria-hidden="true" />
                <span>{footer.location}</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone size={15} className="text-seafoam" aria-hidden="true" />
                <span>{footer.cod}</span>
              </div>

              <div className="flex items-center gap-2">
                <Mail size={15} className="text-seafoam" aria-hidden="true" />
                <span>{footer.email}</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <nav aria-label={footer.explore}>
            <h2 className="mb-3 text-sm font-semibold text-pearl">
              {footer.explore}
            </h2>

            <ul className="grid gap-2">
              {links.map(({ key, href }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="text-sm text-pearl/55 no-underline transition hover:text-seafoam"
                  >
                    {footer.links[key]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* CTA / Social */}
          <div>
            <h2 className="mb-3 text-sm font-semibold text-pearl">
              {footer.stayGlowing}
            </h2>

            <p className="max-w-xs text-sm leading-relaxed text-pearl/55">
              {footer.followText}
            </p>

            <div className="mt-4 flex gap-2">
              <Link
                href="/"
                aria-label={footer.instagram}
                className="flex size-10 items-center justify-center rounded-full bg-pearl/10 text-pearl transition hover:bg-bloom hover:text-pearl"
              >
                <Mail size={17} aria-hidden="true" />
              </Link>

              <Link
                href="/contact"
                aria-label={footer.contactUs}
                className="flex size-10 items-center justify-center rounded-full bg-pearl/10 text-pearl transition hover:bg-tide hover:text-pearl"
              >
                <Mail size={17} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 flex flex-col gap-3 border-t border-pearl/10 pt-5 text-xs text-pearl/40 sm:flex-row sm:items-center sm:justify-between">
          <p>{footer.copyright}</p>

          <div className="flex gap-4">
            <Link
              href="/privacy-policy"
              className="text-pearl/40 no-underline transition hover:text-pearl/70"
            >
              {footer.privacy}
            </Link>

            <Link
              href="/terms"
              className="text-pearl/40 no-underline transition hover:text-pearl/70"
            >
              {footer.terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
