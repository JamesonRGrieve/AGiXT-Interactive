'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { DialogTitle } from '@radix-ui/react-dialog';

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
import { ChatHistoryCommands } from './chat-history';
import { commandMenuItems } from './items';
import { WalletCommands } from './wallet';

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
      <DialogTitle className='sr-only'>Command Menu</DialogTitle>
      <CommandInput placeholder='Type a command or search...' />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {commandMenuItems.map((group, groupIndex) => (
          <div key={group.heading}>
            <CommandGroup heading={group.heading}>
              {group.items.map((item) => (
                <CommandItemComponent key={item.label} item={item} onSelect={() => onSelect(item)} />
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
        <CommandSeparator />
        <WalletCommands closeCommand={() => setOpen(false)} />
      </CommandList>
    </CommandDialog>
  );
}

interface CommandItemProps {
  item: {
    label: string;
    icon: React.ElementType;
    description?: string;
    disabled?: boolean;
    keywords?: string[];
  };
  onSelect: () => void;
}

export function CommandItemComponent({ item, onSelect }: CommandItemProps) {
  return (
    <CommandItem disabled={item.disabled} onSelect={onSelect} keywords={item.keywords}>
      <item.icon className='w-4 h-4 mr-2' />
      <div>
        <div>{item.label}</div>
      </div>
      {item.description && (
        <CommandShortcut className='text-xs font-light text-muted-foreground'>{item.description}</CommandShortcut>
      )}
    </CommandItem>
  );
}
