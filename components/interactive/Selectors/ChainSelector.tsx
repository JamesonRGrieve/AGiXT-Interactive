'use client';

import React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useChains } from '../hooks';

export default function ChainSelector({ value, mutate }: { value?: string; mutate?: (value: string) => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: chainData, error } = useChains();
  console.log('CHAIN DATA', chainData);

  const handleChainChange = (newValue: string) => {
    if (mutate) {
      mutate(newValue);
    } else {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.set('chain', newValue);
      const search = current.toString();
      const query = search ? `?${search}` : '';
      router.push(`${pathname}${query}`);
    }
  };

  if (error) return <div>Failed to load chains</div>;
  if (!chainData) return <div>Loading...</div>;

  return (
    <Select value={value} onValueChange={handleChainChange}>
      <SelectTrigger className='w-full'>
        <SelectValue placeholder='Select a Chain' />
      </SelectTrigger>
      <SelectContent>
        {chainData &&
          chainData.map(
            (chain) =>
              chain && (
                <SelectItem key={chain} value={chain}>
                  {chain}
                </SelectItem>
              ),
          )}
      </SelectContent>
    </Select>
  );
}
