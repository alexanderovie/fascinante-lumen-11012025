import AboutHero from '@/components/sections/about-hero';
import BenefitsShowcase from '@/components/sections/benefits-showcase';
import TeamShowcase from '@/components/sections/team-showcase';
import VideoShowcase from '@/components/sections/video-showcase';
import WhyWeBegan from '@/components/sections/why-we-began';

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  await params;

  return (
    <>
      <AboutHero />
      <BenefitsShowcase />
      <VideoShowcase />
      <TeamShowcase />
      <WhyWeBegan />
    </>
  );
}
