'use client';

import { BiCollapseVertical } from 'react-icons/bi';
import { LuMic, LuTrash2, LuSend, LuRefreshCcw } from 'react-icons/lu';
import { ChatInputProvider, type ChatInputContextType } from './Provider';
import { TextField } from './TextField';
import { UploadedFilesDisplay, FileUploadButton } from './FileUpload';
import { useChatInput } from './Provider';
import { Button } from '@/components/ui/button';
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
      <InputAdornmentButton
        icon={<LuRefreshCcw className='w-4 h-4' />}
        onClick={() => {}}
        tooltipTitle='Reset Conversation'
      />
      <InputAdornmentButton
        icon={<BiCollapseVertical className='w-4 h-4' />}
        onClick={() => {}}
        tooltipTitle='Collapse Input'
      />
      <InputAdornmentButton icon={<LuTrash2 className='w-4 h-4' />} onClick={() => {}} tooltipTitle='Reset Conversation' />
      <div className='flex-grow' />
      {enableVoiceInput && (
        <InputAdornmentButton icon={<LuMic className='w-4 h-4' />} onClick={() => {}} tooltipTitle='Voice Input' />
      )}
      <InputAdornmentButton icon={<LuSend className='w-4 h-4' />} onClick={handleSendMessage} tooltipTitle='Send Message' />
    </div>
  );
}

function InputAdornmentButton({
  icon,
  onClick,
  tooltipTitle,
}: {
  icon: React.ReactNode;
  onClick: () => void;
  tooltipTitle: string;
}) {
  return (
    <TooltipBasic title={tooltipTitle} side='top'>
      <Button size='icon' variant='ghost' className='rounded-full' onClick={onClick}>
        {icon}
      </Button>
    </TooltipBasic>
  );
}
