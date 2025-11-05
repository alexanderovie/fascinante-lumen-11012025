'use client';

import { BarChart3, Filter, Link2 } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import Logo from '@/components/layout/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { useMediaQuery } from '@/hooks/use-media-query';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';
import { cn } from '@/lib/utils';

export const NAV_LINKS = [
  {
    label: 'Features',
    href: '#',
    subitems: [
      {
        label: 'Work with clarity',
        href: '/#features-carousel',
        description: 'This is a subtext that explains a part of the item',
        icon: Link2,
      },
      {
        label: 'Issue tracking with less noise',
        href: '/#features-grid',
        description: 'This is a subtext that explains a part of the item',
        icon: BarChart3,
      },
      {
        label: 'Filtering Tasks, no more distractions',
        href: '/#features-showcase',
        description: 'This is a subtext that explains a part of the item',
        icon: Filter,
      },
    ],
  },
  { label: 'About', href: '/about' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Blog', href: '/blog' },
  { label: 'FAQ', href: '/faq' },
];

const ACTION_BUTTONS = [
  { label: 'Sign in', href: '/signin', variant: 'ghost' as const },
  { label: 'Get started', href: '/signup', variant: 'default' as const },
];
const Navbar = ({
  initialBannerVisible = true,
}: {
  initialBannerVisible?: boolean;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const { isAtLeast } = useMediaQuery();
  const pathname = usePathname();
  const [isBannerVisible, setIsBannerVisible] = useState(initialBannerVisible);
  const prefersReducedMotion = usePrefersReducedMotion();
  const lastScrollY = useRef(0);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rafRef = useRef<number | null>(null);
  const hideNavbar = [
    '/signin',
    '/signup',
    '/docs',
    '/not-found',
    '/forgot-password',
  ].some((route) => pathname.includes(route));

  useEffect(() => {
    const handleBannerDismiss = () => {
      setIsBannerVisible(false);
    };

    window.addEventListener('banner-dismissed', handleBannerDismiss);
    return () =>
      window.removeEventListener('banner-dismissed', handleBannerDismiss);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }

    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Modern scroll detection: hide on scroll down, show immediately on scroll up (UX best practice)
  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const SCROLL_THRESHOLD = 50;
        const HIDE_DELAY = 150; // Delay before hiding (smooth UX)

        // Detect scroll direction
        const isScrollingDown = scrollTop > lastScrollY.current;
        const isScrollingUp = scrollTop < lastScrollY.current;
        lastScrollY.current = scrollTop;

        // Update scrolled state for styling
        setIsScrolled(scrollTop > SCROLL_THRESHOLD);

        // Clear existing timeout
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
        }

        // UX Logic: Show immediately on scroll up, hide with delay on scroll down
        if (scrollTop < SCROLL_THRESHOLD) {
          // Always visible at top
          setIsVisible(true);
        } else if (isScrollingUp) {
          // Show IMMEDIATELY when scrolling up (intent detection)
          setIsVisible(true);
        } else if (isScrollingDown) {
          // Hide with delay when scrolling down (smooth UX)
          hideTimeoutRef.current = setTimeout(() => {
            setIsVisible(false);
          }, HIDE_DELAY);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  if (hideNavbar) return null;

  // Motion variants for scroll animations
  const headerVariants = {
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.3,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
    hidden: {
      y: -100,
      opacity: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.3,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  const containerVariants = {
    normal: {
      height: 'var(--header-height)',
      padding: '0.5rem 1rem',
      transition: {
        duration: prefersReducedMotion ? 0 : 0.3,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
    scrolled: {
      height: 'calc(var(--header-height) - 20px)',
      padding: '0.5rem 1.375rem',
      transition: {
        duration: prefersReducedMotion ? 0 : 0.3,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  return (
    <motion.header
      variants={headerVariants}
      animate={isVisible ? 'visible' : 'hidden'}
      initial="visible"
      className={cn(
        'isolate z-50',
        isScrolled && isAtLeast('lg')
          ? 'fixed top-0 right-0 left-0 px-5.5'
          : 'relative',
      )}
    >
      <motion.div
        variants={containerVariants}
        animate={isScrolled && isAtLeast('lg') ? 'scrolled' : 'normal'}
        className={cn(
          'bg-background/95 navbar-container relative z-50 flex items-center justify-between gap-4 border-b border-border/40 backdrop-blur-xl shadow-lg',
          isScrolled &&
            isAtLeast('lg') &&
            'max-w-7xl rounded-full',
        )}
      >
        <Logo className="" />

        <div className="flex items-center gap-8">
          <NavigationMenu viewport={false} className="hidden lg:block">
            <NavigationMenuList className="">
              {NAV_LINKS.map((item) => (
                <NavigationMenuItem key={item.label}>
                  {item.subitems ? (
                    <>
                      <NavigationMenuTrigger
                        className={cn(
                          'cursor-pointer [&_svg]:ms-2 [&_svg]:size-4',
                          // "after:from-chart-2 after:to-chart-3 after:absolute after:-inset-0.25 after:-z-1 after:rounded-sm after:bg-gradient-to-tr after:opacity-0 after:transition-all after:content-[''] hover:after:opacity-100",
                          pathname.startsWith(item.href) &&
                            'bg-accent font-semibold',
                        )}
                        suppressHydrationWarning
                      >
                        {item.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="">
                        <ul className="grid w-[263px] gap-2">
                          {item.subitems.map((subitem) => (
                            <li key={subitem.label}>
                              <NavigationMenuLink
                                href={subitem.href}
                                className="hover:bg-accent/50 flex-row gap-3 p-3"
                              >
                                <subitem.icon className="text-foreground size-5.5" />
                                <div className="flex flex-col gap-1">
                                  <div className="text-sm font-medium tracking-normal">
                                    {subitem.label}
                                  </div>
                                  <div className="text-muted-foreground text-xs leading-snug">
                                    {subitem.description}
                                  </div>
                                </div>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <NavigationMenuLink
                      href={item.href}
                      className={cn(
                        navigationMenuTriggerStyle(),
                        // "after:from-chart-2 after:to-chart-3 after:absolute after:-inset-0.25 after:-z-1 after:rounded-sm after:bg-gradient-to-tr after:opacity-0 after:transition-all after:content-[''] hover:after:opacity-100",
                        pathname === item.href && 'bg-accent font-semibold',
                      )}
                      suppressHydrationWarning
                    >
                      {item.label}
                    </NavigationMenuLink>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="hidden items-center justify-end gap-4 lg:flex">
            <ThemeToggle />
            {ACTION_BUTTONS.map((button) => (
              <Button
                key={button.label}
                size="sm"
                variant={button.variant}
                className="rounded-full shadow-none"
                asChild
              >
                <Link href={button.href}>{button.label}</Link>
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2 lg:hidden lg:gap-4">
            <ThemeToggle />
            <button
              className="text-muted-foreground relative flex size-8 rounded-sm border lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <div
                className={cn(
                  'absolute top-1/2 left-1/2 block w-4 -translate-x-1/2 -translate-y-1/2',
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute block h-0.25 w-full rounded-full bg-current transition duration-500 ease-in-out',
                    isMenuOpen ? 'rotate-45' : '-translate-y-1.5',
                  )}
                ></span>
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute block h-0.25 w-full rounded-full bg-current transition duration-500 ease-in-out',
                    isMenuOpen ? 'opacity-0' : '',
                  )}
                ></span>
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute block h-0.25 w-full rounded-full bg-current transition duration-500 ease-in-out',
                    isMenuOpen ? '-rotate-45' : 'translate-y-1.5',
                  )}
                ></span>
              </div>
            </button>
          </div>
        </div>
        {/*  Mobile Menu Navigation */}
        <div
          className={cn(
            'bg-background/95 text-accent-foreground fixed inset-0 -z-10 flex flex-col justify-between tracking-normal backdrop-blur-md transition-all duration-500 ease-out lg:hidden',
            isBannerVisible
              ? 'pt-[calc(var(--header-height)+3rem)]'
              : 'pt-[var(--header-height)]',
            isMenuOpen
              ? 'translate-x-0 opacity-100'
              : 'pointer-events-none translate-x-full opacity-0',
          )}
        >
          <div className="container">
            <NavigationMenu
              orientation="vertical"
              className="inline-block w-full max-w-none py-10"
            >
              <NavigationMenuList className="w-full flex-col items-start gap-0">
                {NAV_LINKS.map((item) => (
                  <NavigationMenuItem key={item.label} className="w-full py-2">
                    {item.subitems ? (
                      <Accordion type="single" collapsible className="">
                        <AccordionItem value={item.label}>
                          <AccordionTrigger className="flex w-full cursor-pointer items-center justify-between px-2 py-3 text-base font-normal hover:no-underline">
                            {item.label}
                          </AccordionTrigger>
                          <AccordionContent className="pb-0">
                            <div className="space-y-2">
                              {item.subitems.map((subitem) => (
                                <NavigationMenuLink
                                  key={subitem.label}
                                  href={subitem.href}
                                  onClick={() => setIsMenuOpen(false)}
                                  className={cn(
                                    'text-muted-foreground hover:bg-accent/50 flex flex-row gap-2 p-3 font-medium transition-colors',
                                    pathname === subitem.href &&
                                      'bg-accent font-semibold',
                                  )}
                                  suppressHydrationWarning
                                >
                                  <subitem.icon className="size-5" />
                                  <span className="">{subitem.label}</span>
                                </NavigationMenuLink>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    ) : (
                      <NavigationMenuLink
                        href={item.href}
                        className={cn(
                          'hover:text-foreground text-base transition-colors',
                          pathname === item.href && 'font-semibold',
                        )}
                        onClick={() => setIsMenuOpen(false)}
                        suppressHydrationWarning
                      >
                        {item.label}
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex flex-col gap-4.5 border-t px-6 py-4">
            {ACTION_BUTTONS.map((button) => (
              <Button
                key={button.label}
                variant={
                  button.variant === 'ghost' ? 'outline' : button.variant
                }
                asChild
                className="h-12 flex-1 rounded-sm shadow-sm"
              >
                <Link href={button.href} onClick={() => setIsMenuOpen(false)}>
                  {button.label}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </motion.div>
      {/*  Mobile Menu Navigation */}
        <div
          className={cn(
            'bg-background/95 text-accent-foreground fixed inset-0 -z-10 flex flex-col justify-between tracking-normal backdrop-blur-md transition-all duration-500 ease-out lg:hidden',
            isBannerVisible
              ? 'pt-[calc(var(--header-height)+3rem)]'
              : 'pt-[var(--header-height)]',
            isMenuOpen
              ? 'translate-x-0 opacity-100'
              : 'pointer-events-none translate-x-full opacity-0',
          )}
        >
          <div className="container">
            <NavigationMenu
              orientation="vertical"
              className="inline-block w-full max-w-none py-10"
            >
              <NavigationMenuList className="w-full flex-col items-start gap-0">
                {NAV_LINKS.map((item) => (
                  <NavigationMenuItem key={item.label} className="w-full py-2">
                    {item.subitems ? (
                      <Accordion type="single" collapsible className="">
                        <AccordionItem value={item.label}>
                          <AccordionTrigger className="flex w-full cursor-pointer items-center justify-between px-2 py-3 text-base font-normal hover:no-underline">
                            {item.label}
                          </AccordionTrigger>
                          <AccordionContent className="pb-0">
                            <div className="space-y-2">
                              {item.subitems.map((subitem) => (
                                <NavigationMenuLink
                                  key={subitem.label}
                                  href={subitem.href}
                                  onClick={() => setIsMenuOpen(false)}
                                  className={cn(
                                    'text-muted-foreground hover:bg-accent/50 flex flex-row gap-2 p-3 font-medium transition-colors',
                                    pathname === subitem.href &&
                                      'bg-accent font-semibold',
                                  )}
                                  suppressHydrationWarning
                                >
                                  <subitem.icon className="size-5" />
                                  <span className="">{subitem.label}</span>
                                </NavigationMenuLink>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    ) : (
                      <NavigationMenuLink
                        href={item.href}
                        className={cn(
                          'hover:text-foreground text-base transition-colors',
                          pathname === item.href && 'font-semibold',
                        )}
                        onClick={() => setIsMenuOpen(false)}
                        suppressHydrationWarning
                      >
                        {item.label}
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex flex-col gap-4.5 border-t px-6 py-4">
            {ACTION_BUTTONS.map((button) => (
              <Button
                key={button.label}
                variant={
                  button.variant === 'ghost' ? 'outline' : button.variant
                }
                asChild
                className="h-12 flex-1 rounded-sm shadow-sm"
              >
                <Link href={button.href} onClick={() => setIsMenuOpen(false)}>
                  {button.label}
                </Link>
              </Button>
            ))}
          </div>
        </div>
    </motion.header>
  );
};

export default Navbar;
