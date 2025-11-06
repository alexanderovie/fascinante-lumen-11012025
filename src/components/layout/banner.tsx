'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { getLocaleFromPathname, localizePath } from '@/lib/i18n-utils';

interface BannerProps {
  message: string;
  cta: string;
  auditUrl: string;
}

const Banner = ({ message, cta, auditUrl }: BannerProps) => {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);

  return (
    <div className="bg-primary relative overflow-hidden">
      <div className="container flex items-center justify-center py-3">
        <p className="text-primary-foreground text-center text-sm font-medium">
          {message}{' '}
          <Link
            href={localizePath(auditUrl, locale)}
            className="underline hover:no-underline transition-all"
          >
            {cta}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Banner;
