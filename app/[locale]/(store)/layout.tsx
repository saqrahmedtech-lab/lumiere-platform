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
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer links={FOOTER_LINKS} />
    </>
  );
}
