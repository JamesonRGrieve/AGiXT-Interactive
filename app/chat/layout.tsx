'use client';
import { SidebarMain } from '@/components/jrg/appwrapper/SidebarMain';
import { SidebarInset } from '@/components/ui/sidebar';
import { SidebarHeader } from '@/components/jrg/appwrapper/SidebarHeader';
import { useConversations } from '@/components/interactive/hooks';
import { EditIcon, Edit2, Trash2, Download, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useContext, useState } from 'react';
import { InteractiveConfigContext } from '@/components/interactive/InteractiveConfigContext';
import { TooltipBasic } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { mutate } from 'swr';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { setCookie } from 'cookies-next';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const state = useContext(InteractiveConfigContext);
  const { data: conversations, isLoading: isLoadingConversations } = useConversations();

  // Find the current conversation
  const currentConversation = conversations?.find((conv) => conv.id === state.overrides.conversation);

  const handleAddConversation = async (): Promise<void> => {
    setCookie('agixt-conversation', '-', {
      domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
    });
    state.mutate((oldState) => ({
      ...oldState,
      overrides: { ...oldState.overrides, conversation: '-' },
    }));
  };

  return (
    <SidebarInset>
      <SidebarHeader>
        <div className='flex items-center w-full gap-2'>
          <TooltipBasic title='New Conversation' side='right'>
            <Button size='icon' variant='ghost' onClick={handleAddConversation}>
              <EditIcon className='w-4 h-4 text-muted-foreground' />
            </Button>
          </TooltipBasic>

          <div className='flex items-center flex-1 gap-2 mx-auto'>
            {isLoadingConversations ? (
              <Skeleton className='w-32 h-4' />
            ) : currentConversation ? (
              <>
                <h2 className='text-sm font-medium'>{currentConversation.name}</h2>
                {currentConversation.attachment_count > 0 && (
                  <Badge variant='secondary' className='gap-1'>
                    <Paperclip className='w-3 h-3' />
                    {currentConversation.attachment_count}
                  </Badge>
                )}
              </>
            ) : (
              <p className='text-sm text-muted-foreground'>New Chat</p>
            )}
          </div>
          {currentConversation && <ConversationActions currentConversation={currentConversation} />}
        </div>
      </SidebarHeader>
      <SidebarMain>{children}</SidebarMain>
    </SidebarInset>
  );
}

export function ConversationActions({ currentConversation }: { currentConversation: any }) {
  const state = useContext(InteractiveConfigContext);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [newName, setNewName] = useState('');

  const handleDeleteConversation = async (): Promise<void> => {
    if (currentConversation?.id) {
      await state.agixt.deleteConversation(currentConversation.id);
      await mutate('/conversation');
      state.mutate((oldState) => ({
        ...oldState,
        overrides: { ...oldState.overrides, conversation: '-' },
      }));
      setIsDeleteDialogOpen(false);
    }
  };

  const handleRenameConversation = async (): Promise<void> => {
    if (currentConversation?.id) {
      const response = await state.agixt.renameConversation(state.agent, currentConversation.id, newName);
      if (!response.startsWith('Error')) {
        await mutate('/conversation');
        setIsRenameDialogOpen(false);
      }
    }
  };

  const handleExportConversation = async (): Promise<void> => {
    if (currentConversation?.id) {
      // Get the full conversation content
      const conversationContent = await state.agixt.getConversation('', currentConversation.id);

      // Format the conversation for export
      const exportData = {
        name: currentConversation.name,
        id: currentConversation.id,
        created_at: currentConversation.created_at,
        messages: conversationContent.map((msg) => ({
          role: msg.role,
          content: msg.message,
          timestamp: msg.timestamp,
        })),
      };

      // Create and trigger download
      const element = document.createElement('a');
      const file = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      });
      element.href = URL.createObjectURL(file);
      element.download = `${currentConversation.name}_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  return (
    <>
      <div className='relative z-50 flex items-center gap-1'>
        <TooltipBasic title='Rename Conversation' side='left'>
          <Button
            size='icon'
            variant='ghost'
            onClick={() => {
              setNewName(currentConversation.name);
              setIsRenameDialogOpen(true);
            }}
          >
            <Edit2 className='w-4 h-4' />
          </Button>
        </TooltipBasic>

        <TooltipBasic title='Export Conversation' side='left'>
          <Button size='icon' variant='ghost' onClick={handleExportConversation}>
            <Download className='w-4 h-4' />
          </Button>
        </TooltipBasic>

        <TooltipBasic title='Delete Conversation' side='left'>
          <Button size='icon' variant='ghost' onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash2 className='w-4 h-4' />
          </Button>
        </TooltipBasic>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Conversation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this conversation? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant='destructive' onClick={handleDeleteConversation}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Conversation</DialogTitle>
            <DialogDescription>Enter a new name for this conversation.</DialogDescription>
          </DialogHeader>
          <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder='Enter new name' />
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsRenameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRenameConversation}>Rename</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
