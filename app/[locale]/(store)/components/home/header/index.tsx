import { getDictionary } from "@/app/[locale]/dictionaries";
import { getLocale } from "@/lib/get-locale";

import Navbar from "./Navebar";
import Hero from "./Hero";

async function Header() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);

  return (
    <header>
      <Navbar dict={dict.home.nav} />
      <Hero />
    </header>
  );
}

export default Header;
