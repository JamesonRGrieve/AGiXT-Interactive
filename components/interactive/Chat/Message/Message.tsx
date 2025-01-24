'use client';

import React, { useContext, useState, useMemo, useRef } from 'react';
import {
  LuCopy,
  LuDownload,
  LuThumbsUp,
  LuThumbsDown,
  LuPen as LuEdit,
  LuTrash2,
  LuVolume2,
  LuGitFork,
} from 'react-icons/lu';
import { Loader2 } from 'lucide-react';
import clipboardCopy from 'clipboard-copy';
import { mutate } from 'swr';
import { InteractiveConfigContext } from '../../InteractiveConfigContext';
import MarkdownBlock from './MarkdownBlock';
import formatDate from './formatDate';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipBasic, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getCookie } from 'cookies-next';
import { MessageActions } from './Actions';
import { formatTimeAgo } from '@/lib/time-ago';
import AudioPlayer from './Audio';

export type MessageProps = {
  chatItem: {
    id: string;
    role: string;
    message: string;
    timestamp: string;
    rlhf?: {
      positive: boolean;
      feedback: string;
    };
  };
  lastUserMessage: string;
  alternateBackground?: string;
  setLoading: (loading: boolean) => void;
};

const checkUserMsgJustText = (chatItem: { role: string; message: string }) => {
  if (chatItem.role !== 'USER') return false;

  const message = chatItem.message;
  const hasMarkdownTable = /\n\|.*\|\n(\|-+\|.*\n)?/.test(message);
  return !(
    message.includes('```') ||
    message.includes('`') ||
    message.includes('![') ||
    (message.includes('[') && message.includes('](')) ||
    hasMarkdownTable
  );
};

export default function Message({ chatItem, lastUserMessage, setLoading }: MessageProps): React.JSX.Element {
  const [updatedMessage, setUpdatedMessage] = useState(chatItem.message);
  const { toast } = useToast();
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const formattedMessage = useMemo(() => {
    let formatted = chatItem.message;
    try {
      const parsed = JSON.parse(chatItem.message);
      formatted = (parsed.text || chatItem.message).replace('\\n', '\n');
    } catch (e) {
      // If parsing fails, use original message
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
  const isUserMsgJustText = checkUserMsgJustText(chatItem);

  return (
    <div className={cn('m-3 overflow-hidden flex flex-col gap-2 min-w-48', isUserMsgJustText && 'max-w-[60%] self-end')}>
      {audios && audios.sources.length > 0 ? (
        <>
          {audios.message?.trim() && (
            <MarkdownBlock
              content={audios.message}
              chatItem={{ ...chatItem, message: audios.message }}
              setLoading={setLoading}
            />
          )}
          {audios.sources.map((src) => (
            <AudioPlayer key={src} src={src} />
          ))}
        </>
      ) : (
        <div
          className={
            chatItem.role === 'USER'
              ? 'chat-log-message-user bg-primary rounded-3xl py-1 rounded-br-none px-5 text-primary-foreground'
              : 'chat-log-message-ai p-0 pt-2 text-foreground'
          }
        >
          <MarkdownBlock content={formattedMessage} chatItem={chatItem} setLoading={setLoading} />
        </div>
      )}

      <div className={cn('flex items-center gap-6', chatItem.role === 'USER' && 'flex-row-reverse')}>
        <TimeStamp chatItem={chatItem} />

        <MessageActions
          chatItem={chatItem}
          audios={audios}
          formattedMessage={formattedMessage}
          lastUserMessage={lastUserMessage}
          updatedMessage={updatedMessage}
          setUpdatedMessage={setUpdatedMessage}
        />
      </div>
    </div>
  );
}

export function TimeStamp({ chatItem }: { chatItem: { role: string; timestamp: string } }) {
  const [open, setOpen] = useState(false);

  if (chatItem.timestamp === '') return null;
  const roleLabel = chatItem.role === 'USER' ? 'You' : chatItem.role;
  const timeAgo = formatTimeAgo(chatItem.timestamp);
  const date = formatDate(chatItem.timestamp, false);

  return (
    <p className={'text-sm text-muted-foreground flex gap-1'}>
      <span className='inline font-bold text-muted-foreground'>{roleLabel}</span>•
      <TooltipProvider>
        <Tooltip open={open} onOpenChange={setOpen}>
          <TooltipTrigger asChild>
            <button
              type='button'
              onClick={() => setOpen(true)}
              className='text-left cursor-pointer'
              aria-label='Show full timestamp'
            >
              {timeAgo}
            </button>
          </TooltipTrigger>
          <TooltipContent>{date}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </p>
  );
}
