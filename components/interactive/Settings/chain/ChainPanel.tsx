'use client';

import { useInteractiveConfig } from '@/components/interactive/InteractiveConfigContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Check, Download, Pencil, Plus, Trash2 } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ChainSelector } from '../../Selectors/ChainSelector';
import { useChain } from '../../hooks/useChain';
import ChainSteps from './ChainSteps';

export default function ChainPanel({ showCreateDialog, setShowCreateDialog }) {
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState('');
  const context = useInteractiveConfig();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data: chainData, error } = useChain(searchParams.get('chain') ?? undefined);
  const currentChain = searchParams.get('chain') ?? '';

  useEffect(() => {
    if (renaming) {
      setNewName(currentChain);
    }
  }, [renaming, currentChain]);

  const handleDelete = async () => {
    await context.agixt.deleteChain(currentChain);
    router.push(pathname);
  };

  const handleRename = async () => {
    if (newName && newName !== currentChain) {
      await context.agixt.renameChain(currentChain, newName);
      setRenaming(false);
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.set('chain', newName);
      router.push(`${pathname}?${current.toString()}`);
    }
  };

  const handleExportChain = async () => {
    const chainData = await context.agixt.getChain(currentChain);
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(chainData.steps)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = `${currentChain}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
                <ChainSelector value={currentChain} />
              )}
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => setShowCreateDialog(true)}
                  disabled={renaming || showCreateDialog}
                >
                  <Plus className='h-4 w-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add Chain</TooltipContent>
            </Tooltip>
            {chainData && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant='ghost' size='icon' onClick={handleExportChain} disabled={renaming}>
                      <Download className='h-4 w-4' />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Export Chain</TooltipContent>
                </Tooltip>
                {renaming ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={handleRename}
                        disabled={!newName || newName === currentChain}
                      >
                        <Check className='h-4 w-4' />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Save Chain Name</TooltipContent>
                  </Tooltip>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant='ghost' size='icon' onClick={() => setRenaming(true)}>
                        <Pencil className='h-4 w-4' />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Rename Chain</TooltipContent>
                  </Tooltip>
                )}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant='ghost' size='icon' onClick={handleDelete} disabled={renaming}>
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete Chain</TooltipContent>
                </Tooltip>
              </>
            )}
          </div>
        </div>
      </TooltipProvider>
      {chainData && (
        <div className='mt-4'>
          <ChainSteps />
        </div>
      )}
    </div>
  );
}
