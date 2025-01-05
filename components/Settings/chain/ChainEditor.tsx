'use client';

import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { useInteractiveConfig } from '@/components/interactive/InteractiveConfigContext';
import ChainSteps from './ChainSteps';

export default function ChainEditor() {
  const context = useInteractiveConfig();
  const searchParams = useSearchParams();
  const { data: chainData, mutate } = useSWR(
    `/chain?chain=${searchParams.get('chain')}`,
    async () => await context.agixt.getChain(searchParams.get('chain') ?? ''),
  );

  if (!chainData) {
    return <div>Loading...</div>;
  }

  return (
    <div className='mt-4'>
      <ChainSteps chainData={chainData} chainMutate={mutate} />
    </div>
  );
}
