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
import IconButton from '@/components/jrg/theme/IconButton';
import PromptTest from './PromptTest';

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
            <IconButton
              Icon={Plus}
              label='New'
              description='New Prompt'
              onClick={() => setIsDialogOpen(true)}
              disabled={renaming}
            />
            <IconButton
              Icon={Upload}
              label='Import'
              description='Import/Upload Prompt'
              onClick={() => setImportMode(true)}
              disabled={renaming}
            />
            {promptBody && (
              <>
                <IconButton Icon={Download} label='Export' description='Export/Download Prompt' onClick={prompt.export} />
                {renaming ? (
                  <IconButton
                    Icon={Check}
                    label='Save'
                    description='Save Prompt Name'
                    onClick={() => {
                      prompt.rename(newName);
                      setRenaming(false);
                    }}
                    disabled={!newName || newName === searchParams.get('prompt')}
                  />
                ) : (
                  <IconButton
                    Icon={Pencil}
                    label='Rename'
                    description='Rename Prompt'
                    onClick={() => setRenaming(true)}
                    disabled={renaming}
                  />
                )}
                <IconButton
                  Icon={Trash2}
                  label='Delete'
                  description='Delete Prompt'
                  onClick={prompt.delete}
                  disabled={renaming}
                />
              </>
            )}
          </div>
        </div>
      </TooltipProvider>
      {promptBody && (
        <>
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
            <IconButton
              Icon={Save}
              label='Save'
              description={hasChanges ? 'Save changes to prompt.' : 'No changes to save.'}
              onClick={() => {
                prompt.update(promptBody);
                setHasChanges(false);
              }}
              disabled={!hasChanges || renaming}
            />
          </div>
          <PromptTest promptName={prompt.data?.name} promptContent={promptBody} saved={!hasChanges} />
        </>
      )}

      <NewPromptDialog open={isDialogOpen} setOpen={setIsDialogOpen} importMode={importMode} />
    </div>
  );
}
