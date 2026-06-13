import Footer from "@/app/[locale]/(store)/components/home/Footer";
import Header from "./components/home/header";
const FOOTER_LINKS = [
  "Shop",
  "About us",
  "Track order",
  "Contact",
  "Return policy",
  "Merchant login",
] as const;

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="storefront flex min-h-full flex-1 flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer links={FOOTER_LINKS} />
    </div>
  );
}
