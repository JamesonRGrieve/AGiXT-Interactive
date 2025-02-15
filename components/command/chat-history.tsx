'use client';

import { CommandGroup, CommandItem } from '@/components/ui/command';
import dayjs from 'dayjs';
import { useConversations } from '../interactive/hooks/useConversation';

interface ChatHistoryCommandsProps {
  onSelect: (id: string) => void;
}

export function ChatHistoryCommands({ onSelect }: ChatHistoryCommandsProps) {
  const { data: conversationData, isLoading } = useConversations();

  if (!conversationData || !conversationData.length || isLoading) return null;

  // Filter out conversations with name '-' and take only the first 5
  const recentConversations = conversationData.filter((conversation) => conversation.name !== '-').slice(0, 5);

  return (
    <CommandGroup heading='Recent Chats'>
      {recentConversations.map((conversation) => (
        <CommandItem key={conversation.id} onSelect={() => onSelect(conversation.id)}>
          <div className='flex justify-between w-full'>
            <span>{conversation.name}</span>
            <span className='text-xs text-muted-foreground'>{dayjs(conversation.updatedAt).format('MMM DD')}</span>
          </div>
        </CommandItem>
      ))}
    </CommandGroup>
  );
}
