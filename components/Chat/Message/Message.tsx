'use client';

import React, { useContext, useState, useMemo } from 'react';
import { LuCopy, LuDownload, LuThumbsUp, LuThumbsDown, LuPen as LuEdit, LuTrash2, LuVolume2 } from 'react-icons/lu';
import clipboardCopy from 'clipboard-copy';
import { InteractiveConfigContext } from '../../InteractiveConfigContext';
import MarkdownBlock from './MarkdownBlock';
import formatDate from './formatDate';
import JRGDialog from '@/components/jrg/dialog/Dialog';
import { mutate } from 'swr';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

export type MessageProps = {
  chatItem: { role: string; message: string; timestamp: string; rlhf?: { positive: boolean; feedback: string } };
  lastUserMessage: string;
  alternateBackground?: string;
  setLoading: (loading: boolean) => void;
};

const checkUserMsgJustText = (chatItem: { role: string; message: string }) => {
  if (chatItem.role !== 'USER') return false;

  const message = chatItem.message;
  const hasMarkdownTable = /\n\|.*\|\n(\|[-]+\|.*\n)?/.test(message);
  return !(
    message.includes('```') ||
    message.includes('`') ||
    message.includes('![') ||
    (message.includes('[') && message.includes('](')) ||
    hasMarkdownTable
  );
};

export default function Message({ chatItem, lastUserMessage, setLoading }: MessageProps): React.JSX.Element {
  const enableMessageEditing = process.env.NEXT_PUBLIC_AGIXT_ALLOW_MESSAGE_EDITING === 'true';
  const enableMessageDeletion = process.env.NEXT_PUBLIC_AGIXT_ALLOW_MESSAGE_DELETION === 'true';
  const state = useContext(InteractiveConfigContext);
  const [updatedMessage, setUpdatedMessage] = useState(chatItem.message);
  const formattedMessage = useMemo(() => {
    let formatted = chatItem.message;
    try {
      const parsed = JSON.parse(chatItem.message);
      formatted = (parsed.text || chatItem.message).replace('\\n', '\n');
    } catch (e) {
      // console.error(e);
    }
    return formatted;
  }, [chatItem]);
  const audios = useMemo(() => {
    if (
      !chatItem?.message ||
      typeof chatItem.message !== 'string' ||
      !chatItem.message.includes('<audio controls><source src=')
    ) {
      return null;
    }

    const matches = [...chatItem.message.matchAll(/<audio controls><source src="([^"]+)" type="audio\/wav"><\/audio>/g)];
    const audioSources = matches.map((match) => match[1]);
    return {
      message: chatItem.message.replaceAll(/<audio controls><source src="[^"]+" type="audio\/wav"><\/audio>/g, ''),
      sources: audioSources,
    };
  }, [chatItem]);
  const [vote, setVote] = useState(chatItem.rlhf ? (chatItem.rlhf.positive ? 1 : -1) : 0);
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState('');

  const isUserMsgJustText = checkUserMsgJustText(chatItem);

  return (
    <div className={cn('m-3 overflow-hidden flex flex-col gap-2', isUserMsgJustText && 'max-w-[60%] self-end')}>
      {audios?.sources?.length > 0 ? (
        <>
          {audios?.message?.trim() && (
            <MarkdownBlock
              content={formattedMessage}
              chatItem={{ ...chatItem, message: audios.message }}
              setLoading={setLoading}
            />
          )}
          {audios.sources.map((src) => (
            <audio controls key={src}>
              <source src={src} type='audio/wav' />
              <track kind='captions' />
            </audio>
          ))}
        </>
      ) : (
        <div
          className={cn(
            chatItem.role === 'USER'
              ? 'chat-log-message-user bg-primary rounded-[10px_10px_0_10px] py-3 px-5 text-primary-foreground'
              : 'chat-log-message-ai p-0 pt-8 text-foreground',
          )}
        >
          <MarkdownBlock content={formattedMessage} chatItem={chatItem} setLoading={setLoading} />
        </div>
      )}

      {chatItem.timestamp !== '' && (
        <p className={cn('text-sm text-muted-foreground flex gap-1', chatItem.role === 'USER' && 'self-end')}>
          <p className='inline font-bold text-muted-foreground'>{chatItem.role === 'USER' ? 'You' : chatItem.role}</p>•
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <span>{chatItem.timestamp === undefined ? 'Just Now...' : formatDate(chatItem.timestamp)}</span>
              </TooltipTrigger>
              <TooltipContent>{formatDate(chatItem.timestamp, false)}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </p>
      )}

      <div className={cn('flex gap-2', chatItem.role === 'USER' && 'justify-end items-center')}>
        {(audios?.message?.trim() || !audios) && (
          <>
            {chatItem.role !== 'USER' && process.env.NEXT_PUBLIC_AGIXT_RLHF === 'true' && (
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
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
                    </TooltipTrigger>
                    <TooltipContent>Provide Positive Feedback</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
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
                    </TooltipTrigger>
                    <TooltipContent>Provide Negative Feedback</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant='ghost' size='icon' onClick={() => {}}>
                    <LuVolume2 />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Speak Message</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => {
                      clipboardCopy(formattedMessage);
                    }}
                  >
                    <LuCopy />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy Message</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
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
                </TooltipTrigger>
                <TooltipContent>Download Message</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {enableMessageEditing && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <JRGDialog
                      ButtonComponent={Button}
                      ButtonProps={{ variant: 'ghost', size: 'icon', children: <LuEdit /> }}
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
                  </TooltipTrigger>
                  <TooltipContent>Edit Message</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {enableMessageDeletion && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
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
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder='Your feedback here...'
                />
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
    </div>
  );
}
