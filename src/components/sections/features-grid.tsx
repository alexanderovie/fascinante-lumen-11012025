'use client';

import Image from 'next/image';

import Noise from '@/components/noise';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FeaturesGridProps {
  translations: {
    h2: string;
    description: string;
    features: Array<{
      id: number;
      title: string;
      description: string;
    }>;
  };
}

const imageConfig = [
  { image: '/images/features-grid/1.webp', imageAlt: 'Real-time synchronization', className: 'lg:col-span-3', width: 423, height: 228 },
  { image: '/images/features-grid/2.webp', imageAlt: 'Review intelligence system', className: 'lg:col-span-3', width: 435, height: 228 },
  { image: '/images/features-grid/3.webp', imageAlt: 'Multi-location dashboard', className: 'lg:col-span-4', width: 599, height: 218 },
  { image: '/images/features-grid/4.webp', imageAlt: 'Content intelligence', className: 'lg:col-span-2', width: 292, height: 215 },
  { image: '/images/features-grid/5.webp', imageAlt: 'Market intelligence', className: 'lg:col-span-3', width: 417, height: 175 },
  { image: '/images/features-grid/6.webp', imageAlt: 'Enterprise technology', className: 'lg:col-span-3', width: 433, height: 155 },
];

export default function FeaturesGrid({ translations }: FeaturesGridProps) {
  const features = translations.features.map((feature, index) => ({
    ...feature,
    ...imageConfig[index],
  }));

  return (
    <section id="features-grid" className="section-padding relative">
      <Noise />
      <div className="container">
        {/* Section Header */}
        <div className="mx-auto max-w-5xl space-y-3 lg:space-y-4 lg:text-center">
          <h2 className="text-3xl leading-tight tracking-tight lg:text-5xl">
            {translations.h2}
          </h2>
          <p className="text-muted-foreground text-lg leading-snug lg:text-balance">
            {translations.description}
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-8 grid grid-cols-1 gap-2 lg:mt-12 lg:grid-cols-6">
          {features.map((feature) => (
            <FeatureCard key={feature.id} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  image: string;
  imageAlt: string;
  title: string;
  description: string;
  className?: string;
  width: number;
  height: number;
}

function FeatureCard({
  image,
  imageAlt,
  title,
  description,
  className,
  width,
  height,
}: FeatureCardProps) {
  return (
    <Card className={cn('h-full', className)}>
      {/* Image Section */}
      <CardContent>
        <div className="overflow-hidden rounded-lg">
          <Image
            src={image}
            alt={imageAlt}
            width={width}
            height={height}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            quality={65}
            decoding="async"
            className="w-full object-cover"
          />
        </div>
      </CardContent>

      {/* Content Section */}
      <CardHeader>
        <CardTitle className="text-xl leading-tight font-semibold">
          {title}
        </CardTitle>
        <p className="text-muted-foreground/70 leading-relaxed">
          {description}
        </p>
      </CardHeader>
    </Card>
  );
}
