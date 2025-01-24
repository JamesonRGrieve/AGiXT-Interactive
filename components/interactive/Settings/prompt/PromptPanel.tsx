'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Plus, Trash2, Download, Save, Pencil, Check } from 'lucide-react';
import { mutate } from 'swr';
import PromptSelector from '../../Selectors/PromptSelector';
import { usePrompt } from '../../hooks';
import { AutoResizeTextarea } from '../training';
import { useInteractiveConfig } from '@/components/interactive/InteractiveConfigContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import NewPromptDialog from './PromptDialog';

export default function PromptPanel() {
  const context = useInteractiveConfig();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentPrompt = searchParams.get('prompt') ?? '';
  const currentCategory = searchParams.get('category') ?? 'Default';

  const { data: promptData, error } = usePrompt(currentPrompt || undefined);
  const [promptBody, setPromptBody] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    if (promptData?.content) {
      setPromptBody(promptData.content);
      setHasChanges(false);
    }
  }, [promptData]);

  useEffect(() => {
    if (renaming) {
      setNewName(currentPrompt);
    }
  }, [renaming, currentPrompt]);

  const handleDelete = async () => {
    await context.agixt.deletePrompt(currentPrompt, currentCategory);
    mutate(`/prompts?category=${currentCategory}`);
    router.push(pathname);
  };

  const handleSave = async () => {
    await context.agixt.updatePrompt(currentPrompt, promptBody, currentCategory);
    mutate(`/prompt?category=${currentCategory}&prompt=${currentPrompt}`);
    setHasChanges(false);
  };

  const handleRename = async () => {
    if (newName && newName !== currentPrompt) {
      await context.agixt.renamePrompt(currentPrompt, newName, currentCategory);
      setRenaming(false);
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.set('prompt', newName);
      router.push(`${pathname}?${current.toString()}`);
      mutate(`/prompts?category=${currentCategory}`);
    }
  };

  const handleExportPrompt = async () => {
    const element = document.createElement('a');
    const file = new Blob([promptBody], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${currentCategory}-${currentPrompt}.txt`;
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
              {renaming ? (
                <Input value={newName} onChange={(e) => setNewName(e.target.value)} className='w-full' />
              ) : (
                <PromptSelector />
              )}
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='ghost' size='icon' onClick={() => setIsDialogOpen(true)}>
                  <Plus className='h-4 w-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add Prompt</TooltipContent>
            </Tooltip>
            {promptData && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant='ghost' size='icon' onClick={handleExportPrompt} disabled={renaming}>
                      <Download className='h-4 w-4' />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Export Prompt</TooltipContent>
                </Tooltip>
                {renaming ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={handleRename}
                        disabled={!newName || newName === currentPrompt}
                      >
                        <Check className='h-4 w-4' />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Save Prompt Name</TooltipContent>
                  </Tooltip>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant='ghost' size='icon' onClick={() => setRenaming(true)}>
                        <Pencil className='h-4 w-4' />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Rename Prompt</TooltipContent>
                  </Tooltip>
                )}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant='ghost' size='icon' onClick={handleDelete} disabled={renaming}>
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete Prompt</TooltipContent>
                </Tooltip>
              </>
            )}
          </div>
        </div>
      </TooltipProvider>
      {promptData && (
        <>
          <div className='space-y-2'>
            <AutoResizeTextarea value={promptBody} onChange={handlePromptChange} placeholder='' />
          </div>
          <div className='flex space-x-2'>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button onClick={handleSave} disabled={!hasChanges || renaming}>
                    <Save className='h-4 w-4 mr-2' />
                    Save Prompt
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>{hasChanges ? 'Save changes to prompt' : 'No changes to save'}</TooltipContent>
            </Tooltip>
          </div>
        </>
      )}
      <NewPromptDialog open={isDialogOpen} setOpen={setIsDialogOpen} />
    </div>
  );
}
