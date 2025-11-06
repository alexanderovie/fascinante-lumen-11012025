'use client';

import { ChevronRight, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';
import { getLocaleFromPathname } from '@/lib/i18n-utils';
import { cn } from '@/lib/utils';

interface ProButtonProps {
  className?: string;
}

interface ProTranslations {
  label: string;
  ariaLabel: string;
}

export default function ProButton({ className }: ProButtonProps) {
  const pathname = usePathname();
  const prefersReducedMotion = usePrefersReducedMotion();

  // Safe pathname capture to prevent hydration mismatch
  const [clientPathname, setClientPathname] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setClientPathname(pathname);
  }, [pathname]);

  const locale = getLocaleFromPathname(clientPathname);
  const [translations, setTranslations] = useState<ProTranslations>({
    label: 'Pro',
    ariaLabel: 'Actualizar a Pro',
  });

  // Load translations dynamically based on locale
  useEffect(() => {
    if (!isMounted || !locale) return;

    async function loadTranslations() {
      try {
        const dict = await import(`@/app/[lang]/dictionaries/${locale}.json`);
        setTranslations({
          label: dict.default.common.upgradeToPro,
          ariaLabel: dict.default.common.upgradeToPro,
        });
      } catch (error) {
        console.error('Error loading Pro button translations:', error);
      }
    }
    loadTranslations();
  }, [locale, isMounted]);

  // Páginas donde NO mostrar
  const hideOnPages = ['/signin', '/signup', '/forgot-password', '/not-found', '/pricing'];
  const shouldHide = !isMounted || hideOnPages.some((page) => clientPathname.includes(page));

  // Animaciones para Motion
  const animationProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, scale: 0.9, y: 10 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.9, y: 10 },
        transition: { duration: 0.2, ease: 'easeOut' as const },
      };

  if (shouldHide) return null;

  const pricingPath = `/${locale}/pricing`;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="pro-button"
        {...animationProps}
        className={cn(
          'fixed bottom-6 right-6 z-40',
          'md:bottom-8 md:right-8',
          className,
        )}
      >
        <Button
          size="lg"
          className={cn(
            'group relative flex h-12 items-center gap-2',
            'rounded-full px-5 shadow-xl',
            'bg-foreground text-background',
            'hover:scale-105 hover:shadow-2xl',
            'focus-visible:ring-ring/50 focus-visible:ring-2 focus-visible:ring-offset-2',
            'transition-all duration-200 ease-out',
            'md:h-14 md:px-6',
          )}
          asChild
        >
          <Link href={pricingPath} aria-label={translations.ariaLabel}>
            <Sparkles className="size-4 md:size-5" strokeWidth={2.5} />
            <span className="text-sm font-semibold md:text-base">
              {translations.label}
            </span>
            <div className="bg-background/15 border-background/10 grid size-5 place-items-center rounded-full border md:size-6">
              <ChevronRight className="size-3 transition-transform group-hover:translate-x-0.5 md:size-3.5" />
            </div>
          </Link>
        </Button>
      </motion.div>
    </AnimatePresence>
  );
}
