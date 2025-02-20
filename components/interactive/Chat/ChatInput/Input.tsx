'use client';

import { BiCollapseVertical } from 'react-icons/bi';
import { LuMic, LuTrash2, LuSend, LuRefreshCcw } from 'react-icons/lu';
import { ChatInputProvider, type ChatInputContextType } from './Provider';
import { TextField } from './TextField';
import { UploadedFilesDisplay, FileUploadButton } from './FileUpload';
import { useChatInput } from './Provider';
import { Button, ButtonProps } from '@/components/ui/button';
import { TooltipBasic } from '@/components/ui/tooltip';

export function ChatInputBar(props: ChatInputContextType) {
  return (
    <ChatInputProvider {...props}>
      <ChatInputContent />
    </ChatInputProvider>
  );
}

function ChatInputContent() {
  return (
    <label
      className='flex absolute bg-background bottom-0 items-center left-0 right-0 max-w-[95%] px-2 m-3 mx-auto border overflow-hidden shadow-md rounded-3xl flex-col p-1'
      htmlFor='message'
    >
      <UploadedFilesDisplay />
      <div className='w-full'>
        <TextField />
        <AdornmentsContainer />
      </div>
    </label>
  );
}

export function AdornmentsContainer() {
  const { handleSendMessage, enableVoiceInput } = useChatInput();

  return (
    <div className='flex items-center w-full gap-1'>
      <FileUploadButton />
      <InputAdornmentButton title='Reset Conversation' onClick={() => {}}>
        <LuRefreshCcw className='w-4 h-4' />
      </InputAdornmentButton>
      <InputAdornmentButton title='Collapse Input' onClick={() => {}}>
        <BiCollapseVertical className='w-4 h-4' />
      </InputAdornmentButton>
      <InputAdornmentButton title='Reset Conversation' onClick={() => {}}>
        <LuTrash2 className='w-4 h-4' />
      </InputAdornmentButton>
      <div className='flex-grow' />
      {enableVoiceInput && (
        <InputAdornmentButton title='Voice Input' onClick={() => {}}>
          <LuMic className='w-4 h-4' />
        </InputAdornmentButton>
      )}
      <InputAdornmentButton title='Send Message' onClick={handleSendMessage}>
        <LuSend className='w-4 h-4' />
      </InputAdornmentButton>
    </div>
  );
}

export function InputAdornmentButton({ title, children, ...props }: ButtonProps & { title: string }) {
  return (
    <TooltipBasic title={title} side='top'>
      <Button size='icon' variant='ghost' className='rounded-full' {...props}>
        {children}
      </Button>
    </TooltipBasic>
  );
}
