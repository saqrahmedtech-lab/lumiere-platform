'use client'

import { useParams } from 'next/navigation'

import { defaultLocale, hasLocale, type Locale } from '@/lib/i18n'

/** Reads the current locale from the route params in Client Components. */
export function useLocale(): Locale {
  const params = useParams<{ locale?: string }>()
  const locale = params?.locale ?? ''
  return hasLocale(locale) ? locale : defaultLocale
}
