'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { commandMenuItems } from './items';
import { ChatHistoryCommands } from './chat-history';

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const onSelect = useCallback(
    (item: { url?: string }) => {
      if (item.url) {
        router.push(item.url);
      }
      setOpen(false);
    },
    [router],
  );

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder='Type a command or search...' />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {commandMenuItems.map((group, groupIndex) => (
          <div key={group.heading}>
            <CommandGroup heading={group.heading}>
              {group.items.map((item) => (
                <CommandItem key={item.label} disabled={item.disabled} onSelect={() => onSelect(item)}>
                  <item.icon className='w-4 h-4 mr-2' />
                  <div>
                    <div>{item.label}</div>
                  </div>
                  <CommandShortcut className='text-xs font-light text-muted-foreground'>{item.description}</CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
            {groupIndex < commandMenuItems.length - 1 && <CommandSeparator />}
          </div>
        ))}
        <CommandSeparator />
        <ChatHistoryCommands
          onSelect={(id) => {
            router.push(`/chat/${id}`);
            setOpen(false);
          }}
        />
      </CommandList>
    </CommandDialog>
  );
}
