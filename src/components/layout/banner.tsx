'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
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
      <div className="container flex items-center justify-center gap-3 py-3 sm:gap-4">
        <span className="text-primary-foreground text-center text-sm font-medium">
          {message}
        </span>
        <Button size="sm" variant="light" asChild>
          <Link href={localizePath(auditUrl, locale)}>
            {cta}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Banner;
