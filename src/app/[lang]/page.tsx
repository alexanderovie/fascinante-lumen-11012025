import FAQSection from '@/components/sections/faq-section';
import FeaturesCarousel from '@/components/sections/features-carousel';
import FeaturesGrid from '@/components/sections/features-grid';
import FeaturesShowcase from '@/components/sections/features-showcase';
import Hero from '@/components/sections/hero';
import Logos from '@/components/sections/logos';
import Pricing from '@/components/sections/pricing';
import Testimonials from '@/components/sections/testimonials';

import { getDictionary } from './dictionaries';

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'es' }];
}

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <>
      <Hero translations={dict.hero} auditButtonText={dict.common.auditButton} />
      <Logos socialProof={dict.logos.socialProof} />
      <FeaturesCarousel translations={dict.featuresCarousel} />
      <FeaturesGrid translations={dict.featuresGrid} />
      <FeaturesShowcase translations={dict.featuresShowcase} />
      <Testimonials translations={dict.testimonials} />
      <FAQSection translations={dict.faq} contactText={dict.common.contactWithUs} />
      <Pricing translations={dict.pricing} common={dict.common} />
    </>
  );
}
