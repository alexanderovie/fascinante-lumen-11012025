import type { Metadata } from 'next';

import AuditResults from '@/components/sections/audit-results';

import { getDictionary } from '../../dictionaries';

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'es' }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return {
    title: `${dict.audit.results.title} | ${dict.audit.meta.title}`,
    description: dict.audit.results.description,
    openGraph: {
      title: `${dict.audit.results.title} | ${dict.audit.meta.title}`,
      description: dict.audit.results.description,
      url: 'https://fascinantedigital.com/audit/results',
      type: 'website',
    },
  };
}

export default async function AuditResultsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="min-h-screen">
      <AuditResults translations={dict.audit.results} />
    </div>
  );
}

