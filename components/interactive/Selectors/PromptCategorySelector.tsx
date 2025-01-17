'use client';

import React, { useContext } from 'react';
import { InteractiveConfigContext } from '../InteractiveConfigContext';
import { usePromptCategories } from '../hooks';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useRouter, useSearchParams } from 'next/navigation';

export default function PromptCategorySelector({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (value: string) => void;
}): React.JSX.Element | null {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: categoryData = [] } = usePromptCategories();

  // Don't render if there are 1 or fewer categories
  if (categoryData.length <= 1) {
    return null;
  }
  console.log('Category Data: ', categoryData);
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className='w-full'>
            <Select
              disabled={categoryData.length <= 1}
              value={value || searchParams.get('category') || 'Default'}
              onValueChange={
                onChange
                  ? (value) => onChange(value)
                  : (value) => router.push(`/settings/prompts?category=${value}&prompt=${searchParams.get('prompt') || ''}`)
              }
            >
              <SelectTrigger className='w-full text-xs'>
                <SelectValue placeholder='Select a Category' />
              </SelectTrigger>
              <SelectContent>
                {categoryData.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Select a Prompt Category</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
