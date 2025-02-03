'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Plus, Trash2, Download, Save, Pencil, Check, Upload } from 'lucide-react';
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
  const searchParams = useSearchParams();
  const prompt = usePrompt(searchParams.get('prompt') ?? '');
  const [promptBody, setPromptBody] = useState(prompt.data?.content || '');
  const [hasChanges, setHasChanges] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState('');
  const [importMode, setImportMode] = useState(false);
  console.log(prompt);
  useEffect(() => {
    if (prompt.data?.content) {
      setPromptBody(prompt.data.content);
      setHasChanges(false);
    }
  }, [prompt.data?.content]);

  useEffect(() => {
    if (renaming) {
      setNewName(searchParams.get('prompt') ?? '');
    }
  }, [renaming, searchParams.get('prompt')]);

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
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => {
                    setImportMode(false);
                    setIsDialogOpen(true);
                  }}
                >
                  <Plus className='h-4 w-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add Prompt</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => {
                    setImportMode(true);
                    setIsDialogOpen(true);
                  }}
                  disabled={renaming}
                >
                  <Upload className='h-4 w-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Import/Upload Prompt</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='ghost' size='icon' onClick={prompt.export} disabled={renaming}>
                  <Download className='h-4 w-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Export/Download Prompt</TooltipContent>
            </Tooltip>
            {renaming ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => {
                      prompt.rename(newName);
                      setRenaming(false);
                    }}
                    disabled={!newName || newName === searchParams.get('prompt')}
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
                <Button variant='ghost' size='icon' onClick={prompt.delete} disabled={renaming}>
                  <Trash2 className='h-4 w-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete Prompt</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </TooltipProvider>

      <div className='space-y-2'>
        <AutoResizeTextarea
          value={promptBody}
          onChange={(e) => {
            setPromptBody(e.target.value);
            setHasChanges(e.target.value !== prompt.data?.content);
          }}
          placeholder=''
        />
      </div>
      <div className='flex space-x-2'>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Button
                onClick={() => {
                  prompt.update(promptBody);
                  setHasChanges(false);
                }}
                disabled={!hasChanges || renaming}
              >
                <Save className='h-4 w-4 mr-2' />
                Save Prompt
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>{hasChanges ? 'Save changes to prompt' : 'No changes to save'}</TooltipContent>
        </Tooltip>
      </div>
      <NewPromptDialog open={isDialogOpen} setOpen={setIsDialogOpen} importMode={importMode} />
    </div>
  );
}
