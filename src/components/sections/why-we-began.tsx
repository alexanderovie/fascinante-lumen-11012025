'use client';

import { MailIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import Noise from '@/components/noise';
import { Button } from '@/components/ui/button';

// Stats removed - replaced with professional values-focused content

export default function WhyWeBegan() {
  return (
    <section className="section-padding relative">
      <Noise />
      <div className="bigger-container">
        <div className="flex flex-col-reverse items-center gap-8 md:flex-row lg:gap-12">
          <div className="relative h-full w-full md:w-[453px]">
            {/* Background gradient circles */}
            <div className="bg-chart-2 absolute top-0 left-0 size-60 -translate-x-1/6 rounded-full opacity-30 blur-[80px] will-change-transform md:opacity-70" />
            <div className="bg-chart-3 absolute right-0 bottom-0 size-60 -translate-x-1/4 translate-y-1/6 rounded-full opacity-50 blur-[80px] will-change-transform md:opacity-70" />

            <div className="relative aspect-square size-full overflow-hidden rounded-xl">
              <Image
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=1066&fit=crop"
                alt="Team collaboration"
                fill
                className="rounded-xl object-cover"
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 space-y-6 lg:space-y-8">
            <div className="space-y-8 lg:space-y-12">
              <h2 className="text-3xl leading-none font-medium tracking-tight lg:text-4xl">
                Por Qué Comenzamos
              </h2>
              <div>
                <p>
                  Comenzamos Fascinante Digital porque vimos que los negocios
                  locales necesitaban una forma más inteligente de gestionar su
                  presencia online. La gestión manual de listados, reseñas y
                  contenido consume tiempo valioso que podrías dedicar a crecer
                  tu negocio.
                </p>
                <br />
                <p>
                  Hoy, ayudamos a negocios locales a optimizar su visibilidad
                  online usando tecnología moderna y estrategias probadas, para
                  que puedan enfocarse en lo que realmente importa.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pro Access Section */}
        <div className="mt-16 grid items-center gap-8 lg:mt-24 lg:grid-cols-2 lg:gap-12">
          {/* Content Section */}
          <div className="flex-1 space-y-6 lg:space-y-8">
            <div className="space-y-8 lg:space-y-12">
              <h2 className="text-3xl leading-none font-medium tracking-tight lg:text-4xl">
                Nuestra Misión
              </h2>
              <div className="">
                <p>
                  En Fascinante Digital, nuestra misión es ayudar a los negocios
                  locales a crecer su presencia online de forma inteligente y
                  automatizada. Creemos que el marketing digital no debe ser
                  complicado — debe ser estratégico y efectivo.
                </p>
                <br />
                <p>
                  Usamos tecnología moderna y estrategias probadas para
                  automatizar tu visibilidad local, gestionar tu reputación y
                  optimizar tu presencia online, para que puedas enfocarte en
                  hacer crecer tu negocio.
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Button
                variant="outline"
                className="border-input !text-sm shadow-none"
                size="lg"
                asChild
              >
                <Link href="/contact">
                  Contáctanos
                  <MailIcon className="size-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Images Grid */}
          <div className="grid gap-4">
            {/* First row - 2 images */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative h-48 overflow-hidden rounded-lg">
                <Image
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=800&fit=crop"
                  alt="Team collaboration workspace"
                  width={300}
                  height={200}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="relative h-48 overflow-hidden rounded-lg">
                <Image
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=800&fit=crop"
                  alt="Developer workspace"
                  width={300}
                  height={200}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="relative h-72 overflow-hidden rounded-lg">
              {/* Second row - 1 full width image */}
              <Image
                src="https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=1600&h=800&fit=crop"
                alt="Modern office workspace"
                width={600}
                height={256}
                className="h-full w-full rounded-lg object-cover"
              />
            </div>
          </div>
        </div>

        {/* Performance Statistics Cards - Removed exagerated stats */}
      </div>
    </section>
  );
}
