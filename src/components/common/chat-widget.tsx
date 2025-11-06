'use client';

import { MessageCircle, Minimize2, Send, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';
import { getLocaleFromPathname } from '@/lib/i18n-utils';
import { cn } from '@/lib/utils';

interface ChatWidgetProps {
  className?: string;
}

interface ChatTranslations {
  title: string;
  placeholder: string;
  sendButton: string;
  openChat: string;
  closeChat: string;
}

export default function ChatWidget({ className }: ChatWidgetProps) {
  const pathname = usePathname();
  const prefersReducedMotion = usePrefersReducedMotion();

  // Safe pathname capture to prevent hydration mismatch
  const [clientPathname, setClientPathname] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setClientPathname(pathname);
  }, [pathname]);

  const locale = getLocaleFromPathname(clientPathname);
  const [translations, setTranslations] = useState<ChatTranslations>({
    title: '¿En qué podemos ayudarte?',
    placeholder: 'Escribe tu mensaje...',
    sendButton: 'Enviar',
    openChat: 'Abrir chat',
    closeChat: 'Cerrar chat',
  });

  // Load translations dynamically based on locale
  useEffect(() => {
    if (!isMounted || !locale) return;

    async function loadTranslations() {
      try {
        const dict = await import(`@/app/[lang]/dictionaries/${locale}.json`);
        // Por ahora usar valores por defecto, luego agregar a dictionaries
        setTranslations({
          title: '¿En qué podemos ayudarte?',
          placeholder: 'Escribe tu mensaje...',
          sendButton: 'Enviar',
          openChat: 'Abrir chat',
          closeChat: 'Cerrar chat',
        });
      } catch (error) {
        console.error('Error loading chat translations:', error);
      }
    }
    loadTranslations();
  }, [locale, isMounted]);

  // Páginas donde NO mostrar
  const hideOnPages = ['/signin', '/signup', '/forgot-password', '/not-found'];
  const shouldHide = !isMounted || hideOnPages.some((page) => clientPathname.includes(page));

  // Animaciones para Motion
  const buttonAnimationProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, scale: 0.8, y: 20 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.8, y: 20 },
        transition: { duration: 0.3, ease: 'easeOut' as const },
      };

  const chatWindowAnimationProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, scale: 0.9, y: 20 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.9, y: 20 },
        transition: { duration: 0.2, ease: 'easeOut' as const },
      };

  if (shouldHide) return null;

  return (
    <>
      {/* Chat Button - Floating */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            {...buttonAnimationProps}
            className={cn(
              'fixed bottom-6 right-6 z-50',
              'md:bottom-8 md:right-8',
              className,
            )}
          >
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsOpen(true)}
              className={cn(
                'group relative size-14 rounded-full shadow-2xl',
                '!bg-[#1462FF] text-white',
                'hover:!bg-[#1462FF]/90 hover:scale-110 hover:shadow-2xl',
                'focus-visible:ring-ring/50 focus-visible:ring-2 focus-visible:ring-offset-2',
                'transition-all duration-200 ease-out',
                'md:size-16',
              )}
              aria-label={translations.openChat}
            >
              <MessageCircle className="size-6 md:size-7" strokeWidth={2.5} />

              {/* Notification badge (opcional - puedes activarlo cuando haya mensajes) */}
              {/* <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
                1
              </span> */}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            {...chatWindowAnimationProps}
            className={cn(
              'fixed bottom-6 right-6 z-50',
              'md:bottom-8 md:right-8',
              'w-[calc(100vw-3rem)] max-w-sm',
              'md:w-96',
            )}
          >
            <div className="flex h-[600px] flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between border-b bg-primary px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary-foreground/20">
                    <MessageCircle className="size-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-primary-foreground">
                      {translations.title}
                    </h3>
                    <p className="text-xs text-primary-foreground/80">
                      Normalmente respondemos en minutos
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsOpen(false)}
                    className="size-8 text-primary-foreground hover:bg-primary-foreground/30 hover:text-primary-foreground transition-colors"
                    aria-label={translations.closeChat}
                  >
                    <Minimize2 className="size-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsOpen(false)}
                    className="size-8 text-primary-foreground hover:bg-primary-foreground/30 hover:text-primary-foreground transition-colors"
                    aria-label={translations.closeChat}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="flex flex-col gap-4">
                  {/* Welcome Message */}
                  <div className="flex items-start gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                      <MessageCircle className="size-4 text-muted-foreground" />
                    </div>
                    <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-2.5">
                      <p className="text-sm text-foreground">
                        ¡Hola! 👋 ¿En qué podemos ayudarte hoy?
                      </p>
                    </div>
                  </div>

                  {/* Placeholder for future messages */}
                  {/* Los mensajes se agregarán aquí cuando implementes la lógica */}
                </div>
              </div>

              {/* Input Area */}
              <div className="border-t p-4">
                <div className="flex items-end gap-2">
                  <div className="flex-1 rounded-lg border bg-background px-4 py-2.5 focus-within:ring-2 focus-within:ring-ring">
                    <textarea
                      placeholder={translations.placeholder}
                      rows={1}
                      className="w-full resize-none border-none bg-transparent text-base outline-none placeholder:text-muted-foreground"
                      style={{ fontSize: '16px' }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          // Lógica de envío aquí
                        }
                      }}
                    />
                  </div>
                  <Button
                    size="icon"
                    className="size-10 shrink-0 rounded-lg"
                    aria-label={translations.sendButton}
                    onClick={() => {
                      // Lógica de envío aquí
                    }}
                  >
                    <Send className="size-4" />
                  </Button>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Presiona Enter para enviar, Shift+Enter para nueva línea
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
