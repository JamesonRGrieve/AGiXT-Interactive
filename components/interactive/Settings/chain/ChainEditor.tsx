'use client';

import { useSearchParams } from 'next/navigation';
import { useChain } from '../../hooks';
import ChainSteps from './ChainSteps';

export default function ChainEditor() {
  const searchParams = useSearchParams();
  const { data: chainData, mutate, error } = useChain(searchParams.get('chain') ?? undefined);
  console.log(chainData);
  console.log(error);

  if (!chainData) {
    return <div>Loading...</div>;
  }

  return (
    <div className='mt-4'>
      <ChainSteps chainData={chainData} chainMutate={mutate} />
    </div>
  );
}
