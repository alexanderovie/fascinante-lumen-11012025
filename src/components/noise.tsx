import React from 'react';

import { cn } from '@/lib/utils';

const Noise = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 bg-[url(/images/noise.webp)] bg-repeat opacity-2',
        className,
      )}
    />
  );
};

export default Noise;
