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
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  // If pathname already has locale, continue
  if (pathnameHasLocale) {
    return;
  }

  // Redirect if there is no locale
  const locale = getLocale(request);
  // Handle root path specially
  const newPathname = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`;
  request.nextUrl.pathname = newPathname;
  // e.g. incoming request is /products -> /en/products
  // e.g. incoming request is / -> /en
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next), static files, and API routes
    '/((?!_next|api|favicon.ico|.*\\..*).*)',
    // Explicitly include root path
    '/',
  ],
};
