const dictionaries = {
  en: () => import('./dictionaries/en.json').then((m) => m.default),
  ar: () => import('./dictionaries/ar.json').then((m) => m.default),
}

export type DictionaryLocale = keyof typeof dictionaries

export const getDictionary = (locale: DictionaryLocale) => dictionaries[locale]()
