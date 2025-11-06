import { Metadata } from 'next';

import Pricing from '@/components/sections/pricing';
import PricingTable from '@/components/sections/pricing-table';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Choose the perfect plan for your needs. Compare features and pricing to find the best solution for businesses and enterprises.',
};

export default function PricingPage() {
  return (
    <>
      <Pricing />
      <PricingTable />
    </>
  );
}
