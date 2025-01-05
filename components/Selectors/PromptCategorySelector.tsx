'use client';

import { useSearchParams } from 'next/navigation';
import { useContext } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InteractiveConfigContext } from '../InteractiveConfigContext';
import { usePromptCategories } from '../hooks';

export default function PromptCategorySelector({
  categoryMutate,
  category,
}: {
  categoryMutate: (value: string) => void;
  category: string;
}) {
  const context = useContext(InteractiveConfigContext);
  const searchParams = useSearchParams();
  const { data: categoryData } = usePromptCategories();

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
      <Select value={category} onValueChange={categoryMutate}>
        <SelectTrigger className='w-full'>
          <SelectValue placeholder='Select a Prompt Category' />
        </SelectTrigger>
        <SelectContent>
          {categoryData &&
            (categoryData as string[]).map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
}
