'use client';

import { ArrowUp } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';
import { cn } from '@/lib/utils';

interface BackToTopProps {
  className?: string;
}

export default function BackToTop({ className }: BackToTopProps) {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  const prefersReducedMotion = usePrefersReducedMotion();

  // Thresholds para mostrar/ocultar
  const SCROLL_THRESHOLD = 400; // Aparece después de 400px
  const HIDE_THRESHOLD = 100; // Desaparece antes de 100px

  // Páginas donde NO mostrar
  const hideOnPages = ['/signin', '/signup', '/forgot-password', '/not-found'];
  const shouldHide = hideOnPages.some((page) => pathname.includes(page));

  useEffect(() => {
    if (shouldHide || typeof window === 'undefined') return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop =
            window.scrollY || document.documentElement.scrollTop;

          // Aparece si scroll > 400px, desaparece si < 100px
          setIsVisible(
            scrollTop > SCROLL_THRESHOLD && scrollTop >= HIDE_THRESHOLD,
          );
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, [shouldHide]);

  const scrollToTop = () => {
    if (prefersReducedMotion) {
      window.scrollTo(0, 0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (shouldHide) return null;

  // Animaciones para Motion
  const animationProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, scale: 0.9, y: 10 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.9, y: 10 },
        transition: { duration: 0.2, ease: 'easeOut' as const },
      };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          {...animationProps}
          className={cn(
            'fixed bottom-6 left-6 z-40',
            'md:bottom-8 md:left-8',
            className,
          )}
        >
          <Button
            size="icon"
            variant="default"
            onClick={scrollToTop}
            className={cn(
              'size-11 rounded-full shadow-xl',
              'md:size-12',
              'hover:scale-105',
              'focus-visible:ring-ring/50 focus-visible:ring-[3px]',
            )}
            aria-label="Volver al inicio"
          >
            <ArrowUp className="size-5" strokeWidth={2.1} />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

