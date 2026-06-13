import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import { StoreLinks } from "../types/store.types";

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/\s+/g, "-");
}

function Footer({ links }: { links: StoreLinks }) {
  return (
    <footer
      className="relative overflow-hidden bg-deep px-4 pb-6 pt-10 text-pearl"
      aria-label="Site footer"
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
              aria-label="Lumière — go to homepage"
              className="inline-flex items-center text-xl font-bold tracking-[-0.02em] text-pearl no-underline"
            >
              Lumière<span className="text-bloom">.</span>
            </Link>

            <p className="mt-3 max-w-sm text-sm leading-relaxed text-pearl/60">
              Curated skincare, makeup and body care delivered across Egypt.
            </p>

            <div className="mt-5 grid gap-2 text-sm text-pearl/60">
              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-seafoam" aria-hidden="true" />
                <span>Cairo · Alexandria · All governorates</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone size={15} className="text-seafoam" aria-hidden="true" />
                <span>Cash on delivery available</span>
              </div>

              <div className="flex items-center gap-2">
                <Mail size={15} className="text-seafoam" aria-hidden="true" />
                <span>support@lumiere.eg</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <nav aria-label="Footer links">
            <h2 className="mb-3 text-sm font-semibold text-pearl">Explore</h2>

            <ul className="grid gap-2">
              {links.map((link) => (
                <li key={link}>
                  <Link
                    href={`/${slugify(link)}`}
                    className="text-sm text-pearl/55 no-underline transition hover:text-seafoam"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* CTA / Social */}
          <div>
            <h2 className="mb-3 text-sm font-semibold text-pearl">
              Stay glowing
            </h2>

            <p className="max-w-xs text-sm leading-relaxed text-pearl/55">
              Follow us for new arrivals, beauty tips, and limited-time offers.
            </p>

            <div className="mt-4 flex gap-2">
              <Link
                href="/"
                aria-label="Instagram"
                className="flex size-10 items-center justify-center rounded-full bg-pearl/10 text-pearl transition hover:bg-bloom hover:text-pearl"
              >
                <Mail size={17} aria-hidden="true" />
              </Link>

              <Link
                href="/contact"
                aria-label="Contact us"
                className="flex size-10 items-center justify-center rounded-full bg-pearl/10 text-pearl transition hover:bg-tide hover:text-pearl"
              >
                <Mail size={17} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 flex flex-col gap-3 border-t border-pearl/10 pt-5 text-xs text-pearl/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Lumière. All rights reserved.</p>

          <div className="flex gap-4">
            <Link
              href="/privacy-policy"
              className="text-pearl/40 no-underline transition hover:text-pearl/70"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="text-pearl/40 no-underline transition hover:text-pearl/70"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
