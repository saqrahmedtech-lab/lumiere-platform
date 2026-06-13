import { StaticImageData } from "next/image";
import { type Dictionary } from "@/app/[locale]/dictionaries";

export type StoreLinks = readonly {
  key: keyof Dictionary["footer"]["links"];
  href: string;
}[];

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
