'use client';

import { useEffect, useRef } from 'react';
import { useChatInput } from './Provider';
import { Textarea } from '@/components/ui/textarea';

export function TextField() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { message, setMessage, handleSendMessage } = useChatInput();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      setMessage('');
      await handleSendMessage();
    }
  };

  return (
    <Textarea
      ref={textareaRef}
      className='overflow-x-hidden overflow-y-auto border-none resize-none min-h-4 ring-0 focus-visible:ring-0 max-h-96'
      rows={1}
      name='message'
      id='message'
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      onKeyDown={handleKeyDown}
    />
  );
}
