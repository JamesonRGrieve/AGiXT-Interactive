import React, { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Plus, Trash2, Download, Save } from 'lucide-react';
import { mutate } from 'swr';
import PromptSelector from '../../Selectors/PromptSelector';
import { usePrompt } from '../../hooks';
import { AutoResizeTextarea } from '../training';
import { useInteractiveConfig } from '@/components/interactive/InteractiveConfigContext';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import NewPromptDialog from './PromptDialog';

export default function PromptPanel() {
  const context = useInteractiveConfig();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const { data: promptData, error } = usePrompt(searchParams.get('prompt') ?? undefined);
  const [promptBody, setPromptBody] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (promptData?.content) {
      setPromptBody(promptData.content);
      setHasChanges(false);
    }
  }, [promptData]);

  const handleDelete = async () => {
    await context.agixt.deletePrompt(searchParams.get('prompt') ?? '', searchParams.get('category') ?? 'Default');
    mutate(`/prompts?category=${searchParams.get('category')}`);
    router.push(pathname);
  };

  const handleSave = async () => {
    await context.agixt.updatePrompt(
      searchParams.get('prompt') ?? '',
      promptBody,
      searchParams.get('category') ?? 'Default',
    );
    mutate(`/prompt?category=${searchParams.get('category')}&prompt=${searchParams.get('prompt')}`);
    setHasChanges(false);
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

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPromptBody(e.target.value);
    setHasChanges(e.target.value !== promptData?.content);
  };

  return (
    <div className='space-y-4'>
      <TooltipProvider>
        <div className='flex items-center space-x-2'>
          <div className='flex items-center space-x-2'>
            <div className='w-48'>
              <PromptSelector />
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='ghost' size='icon' onClick={() => setIsDialogOpen(true)}>
                  <Plus className='h-4 w-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add Prompt</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='ghost' size='icon' onClick={handleDelete}>
                  <Trash2 className='h-4 w-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete Prompt</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='ghost' size='icon' onClick={handleExportPrompt}>
                  <Download className='h-4 w-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Export Prompt</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </TooltipProvider>

      <div className='space-y-2'>
        <AutoResizeTextarea value={promptBody} onChange={handlePromptChange} placeholder='' />
      </div>
      <div className='flex space-x-2'>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Button onClick={handleSave} disabled={!hasChanges}>
                <Save className='h-4 w-4 mr-2' />
                Save Prompt
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>{hasChanges ? 'Save changes to prompt' : 'No changes to save'}</TooltipContent>
        </Tooltip>
      </div>

      <NewPromptDialog open={isDialogOpen} setOpen={setIsDialogOpen} />
    </div>
  );
}
