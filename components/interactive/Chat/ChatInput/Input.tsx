import { UploadIcon, Send, Mic, RefreshCcw } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { ChatInputProvider } from './Provider';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ListUploadedFiles, OverrideSwitches, ResetConversation, SendMessage, Timer, UploadFiles } from './Adornments';
import { TooltipBasic } from '@/components/ui/tooltip';
import { BiCollapseVertical } from 'react-icons/bi';
import { VoiceRecorder } from '../VoiceRecorder';
import { LuPaperclip, LuMic, LuTrash2, LuSend, LuRefreshCcw } from 'react-icons/lu';

export function InputContainer() {
  return (
    <ChatInputProvider>
      <label
        className='flex absolute bg-background bottom-0 items-center left-0 right-0 max-w-[95%] px-2 m-3 mx-auto border overflow-hidden shadow-md rounded-3xl flex-col p-1'
        htmlFor='message'
      >
        <div className='w-full'>
          <TextField />
          <AdornmentsContainer />
        </div>
      </label>
    </ChatInputProvider>
  );
}

export function TextField() {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <Textarea
      ref={textareaRef}
      className='overflow-x-hidden overflow-y-auto border-none resize-none min-h-4 ring-0 focus-visible:ring-0 max-h-96'
      rows={1}
      name='message'
      id='message'
      value={message}
      onChange={(e) => setMessage(e.target.value)}
    />
  );
}

export function AdornmentsContainer() {
  return (
    <div className='flex items-center w-full gap-1'>
      <InputAdornmentButton icon={<LuPaperclip className='w-4 h-4' />} onClick={() => {}} tooltipTitle='Upload Files' />
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
      <InputAdornmentButton icon={<LuMic className='w-4 h-4' />} onClick={() => {}} tooltipTitle='Voice Input' />
      <InputAdornmentButton icon={<LuSend className='w-4 h-4' />} onClick={() => {}} tooltipTitle='Send Message' />
    </div>
  );
}

export function InputAdornmentButton({
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
