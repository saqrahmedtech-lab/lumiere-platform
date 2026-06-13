import Footer from "@/app/[locale]/(store)/components/Footer";
import Navbar from "./components/home/Navebar";
import { getLocale } from "@/lib/get-locale";
import { getDictionary } from "../dictionaries";
import { type StoreLinks } from "./types/store.types";

const FOOTER_LINKS: StoreLinks = [
  { key: "shop", href: "/shop" },
  { key: "aboutUs", href: "/about-us" },
  { key: "trackOrder", href: "/track-order" },
  { key: "contact", href: "/contact" },
  { key: "returnPolicy", href: "/return-policy" },
  { key: "merchantLogin", href: "/merchant-login" },
];

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const dict = await getDictionary(locale);

  return (
    <div className="storefront flex min-h-full flex-1 flex-col">
      {/* <Header /> */}
      <Navbar dict={dict.home.nav} />
      <main className="flex-1">{children}</main>
      <Footer links={FOOTER_LINKS} />
    </div>
  );
}
