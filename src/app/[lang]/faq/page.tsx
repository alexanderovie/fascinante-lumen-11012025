import FAQSection from '@/components/sections/faq-section';
import TestimonialsMarquee from '@/components/sections/testimonials-marquee';

import { getDictionary } from '../dictionaries';

export default async function FAQPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="min-h-screen">
      <FAQSection translations={dict.faq} contactText={dict.common.contactWithUs} />
      <TestimonialsMarquee />
    </div>
  );
}
