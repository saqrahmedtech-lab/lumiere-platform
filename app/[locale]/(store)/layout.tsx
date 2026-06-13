import Footer from "@/app/[locale]/(store)/components/Footer";
import Navbar from "./components/home/header/Navebar";
import { getLocale } from "@/lib/get-locale";
import { getDictionary } from "../dictionaries";

const FOOTER_LINKS = [
  "Shop",
  "About us",
  "Track order",
  "Contact",
  "Return policy",
  "Merchant login",
] as const;

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  console.log({ dict });

  return (
    <div className="storefront flex min-h-full flex-1 flex-col">
      {/* <Header /> */}
      <Navbar dict={dict.home.nav} />
      <main className="flex-1">{children}</main>
      <Footer links={FOOTER_LINKS} />
    </div>
  );
}
