import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales, defaultLocale, localeCookieName } from '@/lib/i18n'

const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

function getLocale(request: NextRequest): string {
  const cookieLocale = request.cookies.get(localeCookieName)?.value
  if (cookieLocale && (locales as readonly string[]).includes(cookieLocale)) {
    return cookieLocale
  }

  const acceptLanguage = request.headers.get('accept-language') ?? ''
  for (const locale of locales) {
    if (acceptLanguage.toLowerCase().includes(locale)) return locale
  }
  return defaultLocale
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const matchedLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (matchedLocale) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-locale', matchedLocale)
    const response = NextResponse.next({ request: { headers: requestHeaders } })

    if (request.cookies.get(localeCookieName)?.value !== matchedLocale) {
      response.cookies.set(localeCookieName, matchedLocale, {
        path: '/',
        maxAge: LOCALE_COOKIE_MAX_AGE,
        sameSite: 'lax',
      })
    }

    return response
  }

  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|ico|webp)$).*)',
  ],
}
