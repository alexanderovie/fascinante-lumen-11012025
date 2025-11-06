import Pricing from '@/components/sections/pricing';
import PricingTable from '@/components/sections/pricing-table';

import { getDictionary } from '../dictionaries';

export default async function PricingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <>
      <Pricing translations={dict.pricing} common={dict.common} />
      <PricingTable />
    </>
  );
}
