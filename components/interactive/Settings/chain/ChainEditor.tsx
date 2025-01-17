'use client';

import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { useInteractiveConfig } from '@/components/interactive/InteractiveConfigContext';
import ChainSteps from './ChainSteps';
import { useChain } from '../../hooks';

export default function ChainEditor() {
  const searchParams = useSearchParams();
  const { data: chainData, mutate } = useChain(searchParams.get('chain') ?? undefined);

  if (!chainData) {
    return <div>Loading...</div>;
  }

  return (
    <div className='mt-4'>
      <ChainSteps chainData={chainData} chainMutate={mutate} />
    </div>
  );
}
