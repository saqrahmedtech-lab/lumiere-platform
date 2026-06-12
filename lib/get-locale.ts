import { headers } from 'next/headers'

import { defaultLocale, hasLocale, type Locale } from '@/lib/i18n'

/** Reads the current locale on the server, set by the proxy from the URL. */
export async function getLocale(): Promise<Locale> {
  const locale = (await headers()).get('x-locale') ?? ''
  return hasLocale(locale) ? locale : defaultLocale
}
