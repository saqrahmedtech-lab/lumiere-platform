export const locales = ['en', 'ar'] as const
export type Locale = typeof locales[number]
export const defaultLocale: Locale = 'en'

export function isRTL(locale: string): boolean {
  return locale === 'ar'
}

export function hasLocale(locale: string): locale is Locale {
  return (locales as readonly string[]).includes(locale)
}
