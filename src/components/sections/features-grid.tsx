'use client';

import Image from 'next/image';

import Noise from '@/components/noise';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const FEATURES_DATA = [
  {
    id: 1,
    image: '/images/features-grid/1.webp',
    imageAlt: 'Real-time synchronization',
    title: 'Instant Updates',
    description:
      'Update information in seconds, not hours. What others take days to change, we do in one click automatically.',
    className: 'lg:col-span-3',
    width: 423,
    height: 228,
  },
  {
    id: 2,
    image: '/images/features-grid/2.webp',
    imageAlt: 'Review intelligence system',
    title: 'Review Intelligence',
    description:
      'System detects, analyzes and responds automatically while maintaining your unique brand voice.',
    className: 'lg:col-span-3',
    width: 435,
    height: 228,
  },
  {
    id: 3,
    image: '/images/features-grid/3.webp',
    imageAlt: 'Multi-location dashboard',
    title: 'Multi-Location Control',
    description:
      'Manage 100+ locations as if they were one with consolidated real-time reports and unified dashboard.',
    className: 'lg:col-span-4',
    width: 599,
    height: 218,
  },
  {
    id: 4,
    image: '/images/features-grid/4.webp',
    imageAlt: 'Content intelligence',
    title: 'Content Intelligence',
    description:
      'Publish the right content at the perfect time based on local behavior data and market insights.',
    className: 'lg:col-span-2',
    width: 292,
    height: 215,
  },
  {
    id: 5,
    image: '/images/features-grid/5.webp',
    imageAlt: 'Market intelligence',
    title: 'Market Intelligence',
    description:
      'Discover opportunities your competition doesn\'t see with deep market analysis and competitive insights.',
    className: 'lg:col-span-3',
    width: 417,
    height: 175,
  },
  {
    id: 6,
    image: '/images/features-grid/6.webp',
    imageAlt: 'Enterprise technology',
    title: 'Enterprise Technology',
    description:
      'Advanced enterprise-level capabilities with certifications and compliance that ensure reliability.',
    className: 'lg:col-span-3',
    width: 433,
    height: 155,
  },
];

export default function FeaturesGrid() {
  return (
    <section id="features-grid" className="section-padding relative">
      <Noise />
      <div className="container">
        {/* Section Header */}
        <div className="mx-auto max-w-5xl space-y-3 lg:space-y-4 lg:text-center">
          <h2 className="text-3xl leading-tight tracking-tight lg:text-5xl">
            Local visibility features that scale
          </h2>
          <p className="text-muted-foreground text-lg leading-snug lg:text-balance">
            We automate, optimize, and grow your presence across maps and local
            searches. Professional agency services that work continuously without
            manual intervention.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-8 grid grid-cols-1 gap-2 lg:mt-12 lg:grid-cols-6">
          {FEATURES_DATA.map((feature) => (
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
