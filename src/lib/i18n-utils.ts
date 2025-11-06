/**
 * Helper functions for i18n routing
 */

/**
 * Extracts the locale from the current pathname
 * @param pathname - The current pathname (e.g., '/es/about' or '/en/blog')
 * @returns The locale (e.g., 'es' or 'en'), defaults to 'es' if not found
 */
export function getLocaleFromPathname(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];

  // Check if first segment is a valid locale
  if (firstSegment === 'en' || firstSegment === 'es') {
    return firstSegment;
  }

  // Default to Spanish if no locale found
  return 'es';
}

/**
 * Prepends the locale to a path
 * @param path - The path to localize (e.g., '/about' or '/blog')
 * @param locale - The locale to use (e.g., 'es' or 'en')
 * @returns The localized path (e.g., '/es/about' or '/en/blog')
 */
export function localizePath(path: string, locale: string): string {
  // Don't localize external URLs, anchors, or paths that already have a locale
  if (
    path.startsWith('http') ||
    path.startsWith('#') ||
    path.startsWith('/en/') ||
    path.startsWith('/es/') ||
    path === '/en' ||
    path === '/es'
  ) {
    return path;
  }

  // For root path, return the locale path
  if (path === '/' || path === '') {
    return `/${locale}`;
  }

  // Prepend locale to the path
  return `/${locale}${path}`;
}

