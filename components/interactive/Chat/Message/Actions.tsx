'use client';

import React, { useContext, useState, useMemo } from 'react';
import { LuCopy, LuDownload, LuThumbsUp, LuThumbsDown, LuPen as LuEdit, LuTrash2 } from 'react-icons/lu';
import clipboardCopy from 'clipboard-copy';
import { mutate } from 'swr';
import { InteractiveConfigContext } from '../../InteractiveConfigContext';
import MarkdownBlock from './MarkdownBlock';
import formatDate from './formatDate';
import JRGDialog from './Dialog';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipBasic, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { formatTimeAgo } from '@/lib/time-ago';

export type MessageProps = {
  chatItem: { role: string; message: string; timestamp: string; rlhf?: { positive: boolean; feedback: string } };
  lastUserMessage: string;
  alternateBackground?: string;
  setLoading: (loading: boolean) => void;
};

export function MessageActions({
  chatItem,
  audios,
  formattedMessage,
  lastUserMessage,
  updatedMessage,
  setUpdatedMessage,
}: {
  chatItem: { role: string; message: string; timestamp: string; rlhf?: { positive: boolean; feedback: string } };
  audios: { message: string; sources: string[] } | null;
  formattedMessage: string;
  lastUserMessage: string;
  updatedMessage: string;
  setUpdatedMessage: (value: string) => void;
}) {
  const state = useContext(InteractiveConfigContext);
  const { toast } = useToast();
  const [vote, setVote] = useState(chatItem.rlhf ? (chatItem.rlhf.positive ? 1 : -1) : 0);
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const enableMessageEditing = process.env.NEXT_PUBLIC_AGIXT_ALLOW_MESSAGE_EDITING === 'true';
  const enableMessageDeletion = process.env.NEXT_PUBLIC_AGIXT_ALLOW_MESSAGE_DELETION === 'true';

  return (
    <div className={cn('flex', chatItem.role === 'USER' && 'justify-end items-center')}>
      {(audios?.message?.trim() || !audios) && (
        <>
          {chatItem.role !== 'USER' && process.env.NEXT_PUBLIC_AGIXT_RLHF === 'true' && (
            <>
              <TooltipBasic title='Provide Positive Feedback'>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => {
                    setVote(1);
                    setOpen(true);
                  }}
                >
                  <LuThumbsUp className={cn(vote === 1 && 'text-green-500')} />
                </Button>
              </TooltipBasic>
              <TooltipBasic title='Provide Negative Feedback'>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => {
                    setVote(-1);
                    setOpen(true);
                  }}
                >
                  <LuThumbsDown className={cn(vote === -1 && 'text-red-500')} />
                </Button>
              </TooltipBasic>
            </>
          )}
          {chatItem.role !== 'USER' && !audios && (
            <>
              {audioUrl ? (
                <audio ref={audioRef} controls className='h-8 w-32'>
                  <source src={audioUrl} type='audio/wav' />
                </audio>
              ) : (
                <TooltipBasic title='Speak Message'>
                  <Button variant='ghost' size='icon' onClick={handleTTS} disabled={isLoadingAudio}>
                    {isLoadingAudio ? <Loader2 className='h-4 w-4 animate-spin' /> : <Volume2 className='h-4 w-4' />}
                  </Button>
                </TooltipBasic>
              )}
            </>
          )}
          <TooltipBasic title='Fork Conversation'>
            <Button
              variant='ghost'
              size='icon'
              onClick={async () => {
                try {
                  const response = await fetch(`${process.env.NEXT_PUBLIC_AGIXT_SERVER}/api/conversation/fork`, {
                    method: 'POST',
                    headers: {
                      Authorization: getCookie('jwt'),
                    },
                    body: JSON.stringify({
                      conversation_name: state.overrides?.conversation,
                      message_id: chatItem.id,
                    }),
                  });

                  if (!response.ok) throw new Error('Failed to fork conversation');

                  const data = await response.json();
                  toast({
                    title: 'Conversation Forked',
                    description: `New conversation created: ${data.message}`,
                  });
                } catch (error) {
                  toast({
                    title: 'Error',
                    description: 'Failed to fork conversation',
                    variant: 'destructive',
                  });
                }
              }}
            >
              <LuGitFork />
            </Button>
          </TooltipBasic>
          <TooltipBasic title='Copy Message'>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => {
                clipboardCopy(formattedMessage);
                toast({
                  title: 'Message Copied',
                  description: 'Message has been copied to your clipboard.',
                });
              }}
            >
              <LuCopy />
            </Button>
          </TooltipBasic>
          <TooltipBasic title='Download Message'>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => {
                const element = document.createElement('a');
                const file = new Blob([formattedMessage], {
                  type: 'text/plain;charset=utf-8',
                });
                element.href = URL.createObjectURL(file);
                element.download = `${chatItem.role}-${chatItem.timestamp}.md`;
                document.body.appendChild(element);
                element.click();
              }}
            >
              <LuDownload />
            </Button>
          </TooltipBasic>
          {enableMessageEditing && (
            <TooltipProvider>
              <Tooltip>
                {/* TODO: Replace this with new dialog */}
                <JRGDialog
                  ButtonComponent={Button}
                  ButtonProps={{
                    variant: 'ghost',
                    size: 'icon',
                    children: (
                      <TooltipBasic title='Edit Message'>
                        <LuEdit />
                      </TooltipBasic>
                    ),
                  }}
                  title='Edit Message'
                  onConfirm={async () => {
                    await state.agixt.updateConversationMessage(
                      state.overrides.conversation,
                      chatItem.message,
                      updatedMessage,
                    );
                    mutate('/conversation/' + state.overrides.conversation);
                  }}
                  content={
                    <Textarea
                      value={updatedMessage}
                      onChange={(event) => {
                        setUpdatedMessage(event.target.value);
                      }}
                    />
                  }
                  className='w-[70%] max-w-none'
                />
                <TooltipContent>Edit Message</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {enableMessageDeletion && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  {/* TODO: Replace this with new dialog */}
                  <JRGDialog
                    ButtonComponent={Button}
                    ButtonProps={{ variant: 'ghost', size: 'icon', children: <LuTrash2 /> }}
                    title='Delete Message'
                    onConfirm={async () => {
                      await state.agixt.deleteConversationMessage(state.overrides.conversation, chatItem.message);
                      mutate('/conversation/' + state.overrides.conversation);
                    }}
                    content={`Are you sure you'd like to permanently delete this message from the conversation?`}
                  />
                </TooltipTrigger>
                <TooltipContent>Delete Message</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {chatItem.rlhf && (
            <p className={cn('text-sm', chatItem.rlhf.positive ? 'text-green-500' : 'text-red-500')}>
              {chatItem.rlhf.feedback}
            </p>
          )}

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Provide Feedback</DialogTitle>
                <DialogDescription>Please provide some feedback regarding the message.</DialogDescription>
              </DialogHeader>
              <Textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder='Your feedback here...' />
              <DialogFooter>
                <Button variant='outline' onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setOpen(false);
                    if (vote === 1) {
                      state.agixt.addConversationFeedback(
                        true,
                        chatItem.role,
                        chatItem.message,
                        lastUserMessage,
                        feedback,
                        state.overrides.conversation,
                      );
                    } else {
                      state.agixt.addConversationFeedback(
                        false,
                        chatItem.role,
                        chatItem.message,
                        lastUserMessage,
                        feedback,
                        state.overrides.conversation,
                      );
                    }
                  }}
                >
                  Submit
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
