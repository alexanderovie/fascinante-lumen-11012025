import Pricing from '@/components/sections/pricing';
import PricingTable from '@/components/sections/pricing-table';

export default async function PricingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  await params;

  return (
    <>
      <Pricing />
      <PricingTable />
    </>
  );
}
