import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const locales = ['en', 'es'] as const;
const defaultLocale = 'es';

function detectLocaleFromHeader(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language');
  if (!acceptLanguage) return defaultLocale;

  const languages = new Negotiator({
    headers: { 'accept-language': acceptLanguage },
  }).languages();

  return match(languages, locales, defaultLocale);
}

function resolveLocale(request: NextRequest): string {
  // 1) Respeta cookie si el usuario ya eligió idioma
  const cookie = request.cookies.get('NEXT_LOCALE')?.value as
    | (typeof locales)[number]
    | undefined;
  if (cookie && locales.includes(cookie)) return cookie;

  // 2) Detecta idioma del navegador (fallback a español)
  return detectLocaleFromHeader(request);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Debug: Log para verificar que el middleware se ejecuta
  console.log('[Middleware] Pathname:', pathname);

  // Ignora assets, API y archivos
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico' ||
    /\.[^/]+$/.test(pathname) // *.css, *.js, *.png, etc.
  ) {
    console.log('[Middleware] Skipping (asset/API):', pathname);
    return NextResponse.next();
  }

  // Si ya hay prefijo /en o /es, sigue
  const hasLocale = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
  if (hasLocale) {
    console.log('[Middleware] Has locale, continuing:', pathname);
    return NextResponse.next();
  }

  // Redirige raíz u otras rutas sin prefijo (según ejemplo oficial Context7)
  const locale = resolveLocale(request);
  const newPathname = `/${locale}${pathname}`;
  // e.g. incoming request is /
  // The new URL is now /es
  console.log('[Middleware] Redirecting:', pathname, '->', newPathname);
  const url = new URL(newPathname, request.url);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next).*)',
  ],
};
