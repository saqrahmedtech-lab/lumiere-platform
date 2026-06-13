import { StaticImageData } from "next/image";

export type StoreLinks = readonly [
  "Shop",
  "About us",
  "Track order",
  "Contact",
  "Return policy",
  "Merchant login",
];

export type Product = {
  id: number | string;
  slug?: string;
  badge?: string;
  badgeBg?: string;
  imgBg: string;
  image: StaticImageData | string;
  category: string;
  name: string;
  sub: string;
  price: number;
};
