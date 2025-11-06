import FAQSection from '@/components/sections/faq-section';
import TestimonialsMarquee from '@/components/sections/testimonials-marquee';

export default async function FAQPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  await params;

  return (
    <div className="min-h-screen">
      <FAQSection />
      <TestimonialsMarquee />
    </div>
  );
}
