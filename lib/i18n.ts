import { headers } from 'next/headers'

export const locales = ['en', 'ar'] as const
export type Locale = typeof locales[number]
export const defaultLocale: Locale = 'en'

export function isRTL(locale: string): boolean {
  return locale === 'ar'
}

export function hasLocale(locale: string): locale is Locale {
  return (locales as readonly string[]).includes(locale)
}

/** Reads the current locale on the server, set by the proxy from the URL. */
export async function getLocale(): Promise<Locale> {
  const locale = (await headers()).get('x-locale') ?? ''
  return hasLocale(locale) ? locale : defaultLocale
}
