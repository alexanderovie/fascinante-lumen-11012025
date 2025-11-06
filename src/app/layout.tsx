import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';

import Banner from '@/components/layout/banner';
import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/navbar';
import { StyleGlideProvider } from '@/components/styleglide-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://fascinantedigital.com'),
  title: {
    default: 'Fascinante Digital | Local Visibility Management',
    template: '%s | Fascinante Digital',
  },
  description:
    'Digital marketing agency that optimizes and grows your local visibility automatically 24/7. Professional services with modern technology.',
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
    title: 'Fascinante Digital | Local Visibility Management',
    description:
      'Digital marketing agency that optimizes and grows your local visibility automatically 24/7. Professional services with modern technology.',
    url: 'https://fascinantedigital.com',
    siteName: 'Fascinante Digital',
    locale: 'en_US',
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
    title: 'Fascinante Digital | Local Marketing',
    description:
      'Digital marketing agency that optimizes and grows your local visibility automatically 24/7. Professional services.',
    images: ['/images/og-image.jpg'],
    creator: '@fascinantedigital',
  },
  alternates: {
    canonical: 'https://fascinantedigital.com',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Read banner dismissed state from cookies (server-side)
  const cookieStore = await cookies();
  const bannerDismissed = cookieStore.get('banner-dismissed')?.value === 'true';

  return (
    <html lang="en" suppressHydrationWarning>
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
        </ThemeProvider>
      </body>
    </html>
  );
}
