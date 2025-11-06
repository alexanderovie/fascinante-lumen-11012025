import FAQSection from '@/components/sections/faq-section';
import FeaturesCarousel from '@/components/sections/features-carousel';
import FeaturesGrid from '@/components/sections/features-grid';
import FeaturesShowcase from '@/components/sections/features-showcase';
import Hero from '@/components/sections/hero';
import Logos from '@/components/sections/logos';
import Pricing from '@/components/sections/pricing';
import Testimonials from '@/components/sections/testimonials';

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'es' }];
}

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  await params;

  return (
    <>
      <Hero />
      <Logos />
      <FeaturesCarousel />
      <FeaturesGrid />
      <FeaturesShowcase />
      <Testimonials />
      <FAQSection />
      <Pricing />
    </>
  );
}
