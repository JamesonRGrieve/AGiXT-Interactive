'use client';

import { useContext } from 'react';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { usePathname, useRouter } from 'next/navigation';
import { useConversations } from '../interactive/hooks';
import { InteractiveConfigContext } from '../interactive/InteractiveConfigContext';
import { CommandInput, CommandItem, CommandList, Command } from '../ui/command';
import { Dialog, DialogClose, DialogTrigger, DialogContent } from '../ui/dialog';
import { cn } from '@/lib/utils';
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';

export function ChatHistory() {
  const state = useContext(InteractiveConfigContext);
  const { data: conversationData, isLoading } = useConversations();
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (conversationId: string) => pathname.includes('chat') && pathname.includes(conversationId);

  const handleOpenConversation = ({ conversationId }: { conversationId: string | number }) => {
    console.log('conversationId', JSON.stringify(conversationId, null, 2));
    router.push(`/chat/${conversationId}`);

    state?.mutate((oldState) => ({
      ...oldState,
      overrides: { ...oldState.overrides, conversation: conversationId },
    }));
  };

  if (!conversationData || !conversationData.length || isLoading) return null;

  return (
    <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
      <SidebarGroupLabel>Conversation History</SidebarGroupLabel>
      <SidebarMenu className='ml-1'>
        {conversationData &&
          [...conversationData].splice(0, 6).map((conversation) => (
            <SidebarMenuItem key={conversation.id}>
              <SidebarMenuButton
                side='left'
                onClick={() => handleOpenConversation({ conversationId: conversation.id })}
                className={cn(
                  'flex items-center justify-between w-full transition-colors',
                  isActive(conversation.id) && 'bg-sidebar-accent text-sidebar-accent-foreground font-medium',
                )}
              >
                <span className='truncate'>{conversation.name}</span>
                {conversation.has_notifications && (
                  <Badge
                    variant='default'
                    className={cn(
                      'ml-2',
                      isActive(conversation.id)
                        ? 'bg-sidebar-accent-foreground/10 text-sidebar-accent-foreground'
                        : 'bg-primary/10 text-primary',
                    )}
                  >
                    New
                  </Badge>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}

        {conversationData && conversationData?.length > 5 && (
          <ChatSearch {...{ conversationData, handleOpenConversation }}>
            <SidebarMenuItem>
              <SidebarMenuButton className='text-sidebar-foreground/70' side='left'>
                <DotsHorizontalIcon className='text-sidebar-foreground/70' />
                <span>More</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </ChatSearch>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}

function ChatSearch({
  conversationData,
  handleOpenConversation,
  children,
}: {
  conversationData: any[];
  handleOpenConversation: ({ conversationId }: { conversationId: string | number }) => void;
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='p-0 overflow-hidden shadow-lg'>
        <Command className='[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5'>
          <CommandInput placeholder='Search Conversations...' />
          <CommandList>
            {conversationData.map((conversation) => (
              <CommandItem asChild key={conversation.id}>
                <DialogClose className='w-full' onClick={() => handleOpenConversation({ conversationId: conversation.id })}>
                  <span className='px-2'>{conversation.name}</span>
                </DialogClose>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
