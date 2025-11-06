import { ExternalLink, Video } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import Noise from '@/components/noise';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const GOOGLE_MEET_URL = 'https://meet.google.com/gzp-cjze-tmd';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  await params;

  return {
    title: 'Video Llamada | Consulta Virtual',
    description:
      'Únete a nuestra video llamada para una consulta personalizada sobre nuestros servicios de marketing digital.',
    openGraph: {
      title: 'Video Llamada | Consulta Virtual',
      description:
        'Únete a nuestra video llamada para una consulta personalizada.',
      type: 'website',
    },
  };
}

export default async function MeetPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ auto?: string }>;
}) {
  const { lang } = await params;
  const { auto } = await searchParams;

  // Si auto=true, redirigir automáticamente después de 2 segundos
  if (auto === 'true') {
    redirect(GOOGLE_MEET_URL);
  }

  return (
    <div className="section-padding relative min-h-screen">
      <Noise />
      <div className="container mx-auto flex max-w-2xl items-center justify-center py-12 md:py-20">
        <Card className="w-full shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
              <Video className="size-8 text-primary" />
            </div>
            <CardTitle className="text-3xl md:text-4xl">
              Video Llamada
            </CardTitle>
            <CardDescription className="text-base md:text-lg">
              Únete a nuestra consulta virtual para conocer más sobre nuestros
              servicios de marketing digital
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2 text-center">
              <p className="text-muted-foreground text-sm">
                Haz clic en el botón para unirte a la reunión de Google Meet
              </p>
              <p className="text-muted-foreground text-xs">
                Asegúrate de tener Chrome, Firefox o Edge instalado
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                size="lg"
                className="group h-14 w-full gap-3 text-base"
                asChild
              >
                <a
                  href={GOOGLE_MEET_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Video className="size-5" />
                  Unirse a la Reunión
                  <ExternalLink className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="h-12 w-full"
                asChild
              >
                <Link href={`/${lang}`}>Volver al Inicio</Link>
              </Button>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-2 border-t pt-6">
            <p className="text-muted-foreground text-center text-xs">
              Al unirte, aceptas los{' '}
              <a
                href="https://policies.google.com/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Términos de Servicio
              </a>{' '}
              y la{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Política de Privacidad
              </a>{' '}
              de Google
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

