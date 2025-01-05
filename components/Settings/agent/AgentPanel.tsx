'use client';

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AgentSelector from '../../Selectors/AgentSelector';
import { LuPlus, LuCheck, LuDownload, LuPencil, LuTrash2 } from 'react-icons/lu';
import { useInteractiveConfig } from '@/components/interactive/InteractiveConfigContext';
import { mutate } from 'swr';

export default function AgentPanel({ showCreateDialog, setShowCreateDialog }) {
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState('');
  const context = useInteractiveConfig();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleDelete = async () => {
    const agentName = searchParams.get('agent');
    if (agentName) {
      await context.agixt.deleteAgent(agentName);
      mutate('/agents');
      router.push(pathname);
    }
  };

  const handleRename = async () => {
    const agentName = searchParams.get('agent');
    if (agentName) {
      await context.agixt.renameAgent(agentName, newName);
      setRenaming(false);
      mutate('/agents');
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.set('agent', newName);
      const search = current.toString();
      const query = search ? `?${search}` : '';
      router.push(`${pathname}${query}`);
    }
  };

  const handleExport = async () => {
    const agentName = searchParams.get('agent');
    if (agentName) {
      const agentConfig = await context.agixt.getAgentConfig(agentName);
      const element = document.createElement('a');
      const file = new Blob([JSON.stringify(agentConfig)], { type: 'application/json' });
      element.href = URL.createObjectURL(file);
      element.download = `${agentName}.json`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  return (
    <div className='flex items-center space-x-2 mb-4'>
      {renaming ? (
        <Input value={newName} onChange={(e) => setNewName(e.target.value)} className='flex-grow' />
      ) : (
        <AgentSelector />
      )}
      <Button onClick={() => setShowCreateDialog(true)} disabled={renaming}>
        <LuPlus className='h-4 w-4' />
      </Button>
      {renaming ? (
        <Button onClick={handleRename}>
          <LuCheck className='h-4 w-4' />
        </Button>
      ) : (
        <Button onClick={handleExport}>
          <LuDownload className='h-4 w-4' />
        </Button>
      )}
      <Button onClick={() => setRenaming((old) => !old)}>
        {renaming ? <LuCheck className='h-4 w-4' /> : <LuPencil className='h-4 w-4' />}
      </Button>
      <Button onClick={handleDelete} disabled={renaming}>
        <LuTrash2 className='h-4 w-4' />
      </Button>
    </div>
  );
}
