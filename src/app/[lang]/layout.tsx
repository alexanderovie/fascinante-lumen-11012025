import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import { Suspense } from 'react';

import BackToTop from '@/components/common/back-to-top';
import WhatsAppButton from '@/components/common/whatsapp-button';
import Banner from '@/components/layout/banner';
import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/navbar';
import { StyleGlideProvider } from '@/components/styleglide-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';

import { getDictionary } from './dictionaries';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'es' }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const validLang = lang || 'en';
  const dict = await getDictionary(validLang);

  const localeMap: Record<string, string> = {
    en: 'en_US',
    es: 'es_ES',
  };

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://fascinantedigital.com'),
    title: {
      default: dict.meta.title,
      template: '%s | Fascinante Digital',
    },
    description: dict.meta.description,
    keywords: [
      'digital marketing agency',
      'local visibility management',
      'local search optimization',
      'reputation management',
      'marketing automation',
      'local business marketing',
      'Fascinante Digital',
    ],
    authors: [{ name: 'Fascinante Digital', url: 'https://fascinantedigital.com' }],
    creator: 'Fascinante Digital',
    publisher: 'Fascinante Digital',
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: [
        { url: '/favicon/favicon.ico', sizes: '48x48' },
        { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
        { url: '/favicon/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
        { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
        { url: '/favicon/favicon.ico' },
      ],
      apple: [{ url: '/favicon/apple-touch-icon.png', sizes: '180x180' }],
      shortcut: [{ url: '/favicon/favicon.ico' }],
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      url: 'https://fascinantedigital.com',
      siteName: 'Fascinante Digital',
      locale: (localeMap[validLang] || 'en_US') as string,
      type: 'website',
      images: [
        {
          url: '/images/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Fascinante Digital - Local Visibility Management Agency',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.meta.title,
      description: dict.meta.description,
      images: ['/images/og-image.jpg'],
      creator: '@fascinantedigital',
    },
    alternates: {
      canonical: 'https://fascinantedigital.com',
      languages: {
        en: 'https://fascinantedigital.com/en',
        es: 'https://fascinantedigital.com/es',
      },
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  const validLang = lang || 'en';
  // Read banner dismissed state from cookies (server-side)
  const cookieStore = await cookies();
  const bannerDismissed = cookieStore.get('banner-dismissed')?.value === 'true';

  const localeMap: Record<string, string> = {
    en: 'en',
    es: 'es',
  };

  return (
    <html lang={localeMap[validLang] || 'en'} suppressHydrationWarning>
      <head>
        {/* Preload LCP image for optimal performance */}
        <link
          rel="preload"
          href="/images/hero.webp"
          as="image"
          fetchPriority="high"
        />
      </head>
      <body
        className={cn(
          'flex min-h-screen flex-col antialiased [--header-height:calc(var(--spacing)*14)] lg:[--header-height:calc(var(--spacing)*23)]',
          inter.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <StyleGlideProvider />

          <Banner
            url="https://fascinantedigital.com"
            initialVisible={!bannerDismissed}
          />
          <Navbar initialBannerVisible={!bannerDismissed} />
          <main className="flex-1">{children}</main>
          <Footer />
          <BackToTop />
          <Suspense fallback={null}>
            <WhatsAppButton phoneNumber="+18008864981" />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
