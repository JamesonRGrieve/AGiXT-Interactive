'use client';

import dayjs from 'dayjs';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCommandMenu } from '../command-menu-context';
import { useConversations } from '@/interactive/hooks/useConversation';
import { CommandGroup, CommandItem } from '@/components/ui/command';

export function ChatHistoryGroup() {
  const router = useRouter();
  const { data: conversationData, isLoading } = useConversations();
  const { setOpen } = useCommandMenu();

  const onSelect = useCallback(
    (id: string) => {
      router.push(`/chat/${id}`);
      setOpen(false);
    },
    [router, setOpen],
  );

  if (!conversationData || !conversationData.length || isLoading) return null;

  // Filter out conversations with name '-' and take only the first 5
  const recentConversations = conversationData.filter((conversation) => conversation.name !== '-').slice(0, 5);

  return (
    <CommandGroup heading='Recent Chats'>
      {recentConversations.map((conversation) => (
        <CommandItem
          key={conversation.id}
          onSelect={() => onSelect(conversation.id)}
          keywords={['chat', 'history', 'recent', 'conversation', JSON.stringify(conversation.summary)]}
        >
          <div className='flex justify-between w-full'>
            <span>{conversation.name}</span>
            <span className='text-xs text-muted-foreground'>{dayjs(conversation.updatedAt).format('MMM DD')}</span>
          </div>
        </CommandItem>
      ))}
    </CommandGroup>
  );
}
