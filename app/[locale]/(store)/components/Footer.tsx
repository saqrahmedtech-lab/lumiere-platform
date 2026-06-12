import React from "react";
import { FooterLinks } from "../types/store.types";

function Footer({ links }: { links: FooterLinks }) {
  return (
    <footer className="px-4 pt-6 pb-5 bg-deep" aria-label="Site footer">
      <p className="font-bold mb-1.5 text-[17px] text-white">
        Lumière<span className="text-bloom">.</span>
      </p>
      <p className="text-xs leading-relaxed mb-4 text-[rgba(255,255,255,0.5)]">
        Curated beauty delivered across Egypt.
        <br />
        Cairo · Alexandria · All governorates
      </p>

      <nav
        className="flex flex-wrap gap-x-4 gap-y-2 mb-4"
        aria-label="Footer links"
      >
        {links.map((link) => (
          <a
            key={link}
            href={`/${link.toLowerCase().replace(" ", "-")}`}
            className="text-xs no-underline text-[rgba(255,255,255,0.6)]"
          >
            {link}
          </a>
        ))}
      </nav>

      <div className="pt-3 text-xs border-t-[0.5px] border-t-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.35)]">
        © 2026 Lumière · All rights reserved
      </div>
    </footer>
  );
}

export default Footer;
