import { getDictionary } from "@/app/[locale]/dictionaries";
import { getLocale } from "@/lib/get-locale";

import Navbar from "./Navebar";
import Hero from "./Hero";

async function Header() {
  return (
    <header>
      <Hero />
    </header>
  );
}

export default Header;
