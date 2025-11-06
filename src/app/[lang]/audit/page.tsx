import type { Metadata } from 'next';

import AuditForm from '@/components/sections/audit-form';
import AuditResults from '@/components/sections/audit-results';

import { getDictionary } from '../dictionaries';

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
    title: dict.audit.meta.title,
    description: dict.audit.meta.description,
    openGraph: {
      title: dict.audit.meta.title,
      description: dict.audit.meta.description,
      url: 'https://fascinantedigital.com/audit',
      type: 'website',
    },
  };
}

export default async function AuditPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="min-h-screen">
      <AuditForm translations={dict.audit} />
      <AuditResults translations={dict.audit.results} />
    </div>
  );
}
