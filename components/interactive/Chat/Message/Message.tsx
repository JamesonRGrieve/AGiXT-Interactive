'use client';

import React, { useState, useMemo } from 'react';
import MarkdownBlock from './MarkdownBlock';
import formatDate from './formatDate';
import JRGDialog from './Dialog';
import { cn } from '@/lib/utils';
import { TooltipBasic } from '@/components/ui/tooltip';
import { formatTimeAgo } from '@/lib/time-ago';
import { MessageActions } from './Actions';

export type MessageProps = {
  chatItem: { role: string; message: string; timestamp: string; rlhf?: { positive: boolean; feedback: string } };
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
  const isUserMsgJustText = checkUserMsgJustText(chatItem);

  return (
    <div className={cn('m-3 overflow-hidden flex flex-col gap-2 min-w-48', isUserMsgJustText && 'max-w-[60%] self-end')}>
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
        {chatItem.timestamp !== '' && (
          <p className={'text-sm text-muted-foreground flex gap-1'}>
            <p className='inline font-bold text-muted-foreground'>{chatItem.role === 'USER' ? 'You' : chatItem.role}</p>•
            <TooltipBasic title={formatDate(chatItem.timestamp, false)}>
              <span>{formatTimeAgo(chatItem.timestamp)}</span>
            </TooltipBasic>
          </p>
        )}

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
