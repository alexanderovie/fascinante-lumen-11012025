'use client';

import { ArrowUp } from 'lucide-react';
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';
import { cn } from '@/lib/utils';

interface BackToTopProps {
  className?: string;
}

export default function BackToTop({ className }: BackToTopProps) {
  const pathname = usePathname();
  const prefersReducedMotion = usePrefersReducedMotion();

  // Motion's useScroll hook for smooth scroll tracking (Context7 best practice)
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Transform progress to stroke-dashoffset
  const CIRCUMFERENCE = 2 * Math.PI * 20; // radius = 20
  const strokeDashoffset = useTransform(
    smoothProgress,
    [0, 1],
    [CIRCUMFERENCE, 0],
  );

  // Visibility based on scroll position
  const [isVisible, setIsVisible] = useState(false);

  // Páginas donde NO mostrar
  const hideOnPages = ['/signin', '/signup', '/forgot-password', '/not-found'];
  const shouldHide = hideOnPages.some((page) => pathname.includes(page));

  useEffect(() => {
    if (shouldHide || typeof window === 'undefined') return;

    const SCROLL_THRESHOLD = 400;
    const HIDE_THRESHOLD = 100;

    const handleScroll = () => {
      const scrollTop =
        window.scrollY || document.documentElement.scrollTop;
      setIsVisible(
        scrollTop > SCROLL_THRESHOLD && scrollTop >= HIDE_THRESHOLD,
      );
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

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
        initial: { opacity: 0, scale: 0.8, y: 20 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.8, y: 20 },
        transition: { duration: 0.3, ease: 'easeOut' as const },
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
            variant="ghost"
            onClick={scrollToTop}
            className={cn(
              'group relative flex size-11 items-center justify-center',
              'rounded-full bg-background/80 backdrop-blur-sm',
              'border border-border shadow-lg',
              'hover:scale-110 hover:shadow-xl',
              'focus-visible:ring-ring/50 focus-visible:ring-2 focus-visible:ring-offset-2',
              'transition-all duration-200 ease-out',
              'md:size-12',
            )}
            aria-label="Volver al inicio"
          >
            {/* SVG Progress Ring - Cubre todo el botón, centrado */}
            <svg
              className="absolute inset-0 -rotate-90 pointer-events-none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              {/* Background circle (subtle track) - borde completo */}
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-muted-foreground/20"
              />
              {/* Progress circle (animated with Motion) - se rellena con scroll */}
              <motion.circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="text-foreground"
                style={{
                  transformOrigin: '24px 24px',
                }}
              />
            </svg>

            {/* Icono centrado */}
            <ArrowUp
              className="relative z-10 size-5 text-foreground transition-transform duration-200 group-hover:-translate-y-0.5"
              strokeWidth={2.5}
            />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
