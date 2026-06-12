import { LucideIcon } from "lucide-react";

export type StoreLinks = readonly [
  "Shop",
  "About us",
  "Track order",
  "Contact",
  "Return policy",
  "Merchant login",
];

export type Product = {
  id: number;
  badge: string | null;
  badgeBg: string | null;
  imgBg: string;
  icon: LucideIcon;
  iconColor: string;
  category: string;
  name: string;
  sub: string;
  price: number;
};
