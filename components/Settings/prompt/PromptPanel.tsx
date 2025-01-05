'use client';

import { Button } from '@/components/ui/button';
import { LuPlus } from 'react-icons/lu';

export default function PromptPanel({ setShowCreateDialog }) {
  return (
    <div className='flex justify-end mb-4'>
      <Button onClick={() => setShowCreateDialog(true)}>
        <LuPlus className='h-4 w-4 mr-2' />
        New Prompt
      </Button>
    </div>
  );
}
