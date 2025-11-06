# 📋 Referencias de Middleware i18n - Next.js 15

## 🔗 Repositorios Encontrados

### 1. **next-app-i18n-starter** (S0vers)
- URL: https://github.com/S0vers/next-app-i18n-starter
- Demo: https://next-app-i18n-starter.vercel.app/
- **Problema**: Usa `next-intl` (librería completa)
- Middleware: `src/middleware.ts` (usa `createMiddleware` de next-intl)

### 2. **Ejemplo Oficial Context7**
- Documentación: Next.js 15 App Router Internationalization
- **Ejemplo simple sin librerías**:
```javascript
import { NextResponse } from "next/server";

let locales = ['en-US', 'nl-NL', 'nl']

function getLocale(request) { /* ... */ }

export function proxy(request) {
  const { pathname } = request.nextUrl
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    '/((?!_next).*)',
  ]
}
```

**NOTA**: Este ejemplo usa `proxy` pero en Next.js 15.5.6 se usa `middleware`.

## 🔍 Diferencias Clave

### Ejemplo Oficial Context7:
- ✅ Función: `proxy` (pero debe ser `middleware` en 15.5.6)
- ✅ Modifica: `request.nextUrl.pathname` directamente
- ✅ Matcher: `'/((?!_next).*)'`
- ⚠️ No incluye detección de locale (solo sugiere `getLocale(request)`)

### Nuestro Middleware:
- ✅ Función: `middleware` (correcto para 15.5.6)
- ✅ Detección: Librerías especializadas (@formatjs/intl-localematcher, negotiator)
- ✅ Cookies: Soporte para NEXT_LOCALE
- ✅ Matcher: `'/((?!_next).*)'` (igual que ejemplo oficial)
- ⚠️ Construcción URL: Usamos `new URL()` en lugar de modificar directamente

## 🎯 Posible Problema

El ejemplo oficial modifica `request.nextUrl.pathname` directamente, pero nosotros usamos `new URL()`. Esto podría ser el problema en Next.js 15.5.6 con Turbopack.

