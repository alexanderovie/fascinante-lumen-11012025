'use client';

import { AnimatePresence, motion } from 'motion/react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';
import { getLocaleFromPathname } from '@/lib/i18n-utils';
import { cn } from '@/lib/utils';

interface WhatsAppButtonProps {
  phoneNumber: string;
  className?: string;
}

interface WhatsAppTranslations {
  ariaLabel: string;
  defaultMessage: string;
}

export default function WhatsAppButton({
  phoneNumber,
  className,
}: WhatsAppButtonProps) {
  const pathname = usePathname();
  const prefersReducedMotion = usePrefersReducedMotion();
  const locale = getLocaleFromPathname(pathname);
  const [translations, setTranslations] = useState<WhatsAppTranslations>({
    ariaLabel: 'Contactar por WhatsApp',
    defaultMessage: '',
  });

  // Load translations dynamically based on locale
  useEffect(() => {
    async function loadTranslations() {
      try {
        const dict = await import(`@/app/[lang]/dictionaries/${locale}.json`);
        setTranslations({
          ariaLabel: dict.default.common.whatsappAriaLabel,
          defaultMessage: dict.default.common.whatsappDefaultMessage,
        });
      } catch (error) {
        // Fallback to default Spanish if loading fails
        console.error('Error loading WhatsApp translations:', error);
      }
    }
    loadTranslations();
  }, [locale]);

  // Páginas donde NO mostrar
  const hideOnPages = ['/signin', '/signup', '/forgot-password', '/not-found'];
  const shouldHide = hideOnPages.some((page) => pathname.includes(page));

  // WhatsApp URL format: wa.me/PHONENUMBER?text=MESSAGE (sin +)
  const whatsappNumber = phoneNumber.replace(/[^0-9]/g, '');
  const encodedMessage = translations.defaultMessage
    ? encodeURIComponent(translations.defaultMessage)
    : '';
  const whatsappUrl = `https://wa.me/${whatsappNumber}${
    encodedMessage ? `?text=${encodedMessage}` : ''
  }`;

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

  return (
    <AnimatePresence>
      <motion.div
        {...animationProps}
        className={cn(
          'fixed bottom-6 right-6 z-40',
          'md:bottom-8 md:right-8',
          className,
        )}
      >
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'group relative flex size-11 items-center justify-center',
            'rounded-full bg-[#25D366] shadow-xl',
            'transition-all duration-200 ease-out',
            'hover:scale-105 hover:shadow-2xl',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]/50 focus-visible:ring-offset-2',
            'active:scale-95',
            'md:size-12',
          )}
          aria-label={translations.ariaLabel}
        >
          {/* Logo oficial de WhatsApp de Wikipedia - Solo el logo principal sin efectos verdes */}
          <svg
            className="size-5"
            viewBox="0 0 175.216 175.552"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id="b"
                x1="85.915"
                x2="86.535"
                y1="32.567"
                y2="137.092"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="#57d163" />
                <stop offset="1" stopColor="#23b33a" />
              </linearGradient>
            </defs>
            {/* Removed gray shadow path and white base - only keeping main logo */}
            <path
              fill="url(#b)"
              d="M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.312-6.179 22.559 23.146-6.069 2.235 1.324c9.387 5.571 20.15 8.518 31.126 8.524h.023c33.707 0 61.14-27.426 61.153-61.135a60.75 60.75 0 0 0-17.895-43.251 60.75 60.75 0 0 0-43.235-17.929z"
            />
            <path
              fill="#fff"
              fillRule="evenodd"
              d="M68.772 55.603c-1.378-3.061-2.828-3.123-4.137-3.176l-3.524-.043c-1.226 0-3.218.46-4.902 2.3s-6.435 6.287-6.435 15.332 6.588 17.785 7.506 19.013 12.718 20.381 31.405 27.75c15.529 6.124 18.689 4.906 22.061 4.6s10.877-4.447 12.408-8.74 1.532-7.971 1.073-8.74-1.685-1.226-3.525-2.146-10.877-5.367-12.562-5.981-2.91-.919-4.137.921-4.746 5.979-5.819 7.206-2.144 1.381-3.984.462-7.76-2.861-14.784-9.124c-5.465-4.873-9.154-10.891-10.228-12.73s-.114-2.835.808-3.751c.825-.824 1.838-2.147 2.759-3.22s1.224-1.84 1.836-3.065.307-2.301-.153-3.22-4.032-10.011-5.666-13.647"
            />
          </svg>

          {/* Indicador de pulso sutil (mantener el efecto de zumbido) */}
          <span
            className={cn(
              'absolute inset-0 rounded-full',
              'bg-[#25D366] opacity-20',
              'animate-ping',
              'hidden md:block',
            )}
            aria-hidden="true"
          />
        </a>
      </motion.div>
    </AnimatePresence>
  );
}

