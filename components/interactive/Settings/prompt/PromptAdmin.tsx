'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { LuDownload, LuTrash2 } from 'react-icons/lu';
import { mutate } from 'swr';
import PromptSelector from '../../Selectors/PromptSelector';
import PromptCategorySelector from '../../Selectors/PromptCategorySelector';
import { usePrompt } from '../../hooks';
import { AutoResizeTextarea } from '../training';
import { useInteractiveConfig } from '@/components/interactive/InteractiveConfigContext';
import { Button } from '@/components/ui/button';

export default function PromptAdmin() {
  const context = useInteractiveConfig();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const { data: promptData } = usePrompt(searchParams.get('prompt') ?? undefined, searchParams.get('category') ?? undefined);
  useEffect(() => {
    if (!searchParams.get('category')) {
      router.push(`${pathname}?${new URLSearchParams({ category: 'Default', prompt: 'Think About It' }).toString()}`);
    }
  }, [searchParams]);
  const [promptBody, setPromptBody] = useState('');

  useEffect(() => {
    if (promptData) {
      setPromptBody(promptData);
    }
  }, [promptData]);

  const handleDelete = async () => {
    await context.agixt.deletePrompt(searchParams.get('prompt') ?? '', searchParams.get('category') ?? '');
    mutate(`/prompts?category=${searchParams.get('category')}`);
    router.push(pathname);
  };

  const handleSave = async () => {
    await context.agixt.updatePrompt(searchParams.get('prompt') ?? '', promptBody, searchParams.get('category') ?? '');
    mutate(`/prompt?category=${searchParams.get('category')}&prompt=${searchParams.get('prompt')}`);
  };

  const handleExportPrompt = async () => {
    const element = document.createElement('a');
    const file = new Blob([promptBody], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${searchParams.get('category')}-${searchParams.get('prompt')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center space-x-2'>
        <PromptCategorySelector
          category={searchParams.get('category') ?? ''}
          categoryMutate={(newValue) => {
            router.push(`${pathname}?${new URLSearchParams({ category: newValue, prompt: '' }).toString()}`);
          }}
        />
        <PromptSelector
          value={searchParams.get('prompt') ?? ''}
          onChange={(newValue) => {
            router.push(
              `${pathname}?${new URLSearchParams({ category: searchParams.get('category'), prompt: newValue }).toString()}`,
            );
          }}
        />
      </div>
      <div className='space-y-2'>
        <h2 className='text-lg font-semibold'>Prompt Content</h2>
        <AutoResizeTextarea value={promptBody} onChange={(e) => setPromptBody(e.target.value)} placeholder='' />
      </div>
      <div className='flex space-x-2'>
        <Button onClick={handleSave}>Save Prompt</Button>
        <Button variant='outline' onClick={handleExportPrompt}>
          <LuDownload className='mr-2 h-4 w-4' /> Export Prompt
        </Button>
        <Button variant='destructive' onClick={handleDelete}>
          <LuTrash2 className='mr-2 h-4 w-4' /> Delete Prompt
        </Button>
      </div>
    </div>
  );
}
