import { BiCollapseVertical } from 'react-icons/bi';
import { LuPaperclip, LuMic, LuTrash2, LuSend, LuRefreshCcw } from 'react-icons/lu';
import { ChatInputProvider, type ChatInputContextType } from './Provider';
import { TextField } from './TextField';
import { Button } from '@/components/ui/button';
import { TooltipBasic } from '@/components/ui/tooltip';

export function ChatInputBar(props: ChatInputContextType) {
  return (
    <ChatInputProvider {...props}>
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
    </ChatInputProvider>
  );
}

export function UploadedFilesDisplay() {
  const files = null;

  if (!files) return null;
  return (
    <div className='flex items-center gap-1 p-1 w-full overflow-x-auto'>
      <UploadedFileCard file={new File([''], 'test.txt', { type: 'text/plain' })} />
      <UploadedFileCard file={new File([''], 'test.md', { type: 'text/markdown' })} />
      <UploadedFileCard file={new File([''], 'test.pdf', { type: 'application/pdf' })} />
      <UploadedFileCard file={new File([''], 'test.png', { type: 'image/png' })} />
      <UploadedFileCard file={new File([''], 'test.jpg', { type: 'image/jpeg' })} />
    </div>
  );
}

export function UploadedFileCard({ file }: { file: File }) {
  const fileSize = (file.size / 1024).toFixed(1) + ' KB';

  return (
    <div className='flex items-start gap-2 bg-muted/30 hover:bg-muted/50 transition-colors rounded-lg px-3 py-2 max-w-fit'>
      <div className='mt-0.5'>
        <LuPaperclip className='w-4 h-4 text-muted-foreground' />
      </div>
      <div className='flex flex-col min-w-20'>
        <span className='text-sm font-medium truncate max-w-[200px]'>{file.name}</span>
        <span className='text-xs text-muted-foreground'>{fileSize}</span>
      </div>
      <Button
        size='icon'
        variant='ghost'
        className='h-5 w-5 rounded-full hover:bg-destructive/10 hover:text-destructive mt-0.5'
        onClick={() => {}}
      >
        <LuTrash2 className='w-3 h-3' />
      </Button>
    </div>
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
