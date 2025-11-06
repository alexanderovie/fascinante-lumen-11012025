import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'es'];
const defaultLocale = 'en';

function getLocale(request: NextRequest): string {
  // Get Accept-Language header
  const acceptLanguage = request.headers.get('accept-language') ?? undefined;
  const headers = { 'accept-language': acceptLanguage || 'en' };

  // Get preferred languages from header
  const languages = new Negotiator({ headers }).languages();

  // Match with supported locales
  return match(languages, locales, defaultLocale);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  // If pathname already has locale, continue
  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Get preferred locale
  const locale = getLocale(request);

  // Redirect to locale-prefixed pathname
  request.nextUrl.pathname = `/${locale}${pathname}`;

  // Redirect to new URL
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|favicon.ico|.*\\..*).*)',
    // Optional: only run on root (/) URL
    // '/'
  ],
};
