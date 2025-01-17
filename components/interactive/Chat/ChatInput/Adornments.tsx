'use client';

import { ReactNode } from 'react';
import { CheckCircle as LuCheckCircle } from 'lucide-react';
import { LuPaperclip, LuSend, LuArrowUp, LuLoader, LuTrash2 } from 'react-icons/lu';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipBasic, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import SwitchDark from '@/components/jrg/theme/SwitchDark';
import SwitchColorblind from '@/components/jrg/theme/SwitchColorblind';
import { OverrideSwitch } from '../OverrideSwitch';

export const Timer = ({ loading, timer }: { loading: boolean; timer: number }) => {
  const tooltipMessage = loading
    ? `Your most recent interaction has been underway (including all activities) for ${(timer / 10).toFixed(1)} seconds.`
    : `Your last interaction took ${(timer / 10).toFixed(1)} seconds to completely resolve.`;

  return (
    <TooltipBasic title={tooltipMessage} side='left'>
      <div className='flex items-center space-x-1'>
        <span className='text-sm'>{(timer / 10).toFixed(1)}s</span>
        {loading ? <LuLoader className='animate-spin' /> : <LuCheckCircle className='text-green-500' />}
      </div>
    </TooltipBasic>
  );
};

export const OverrideSwitches = ({ showOverrideSwitches }: { showOverrideSwitches: string }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size='icon' variant='ghost' className='rounded-full'>
          <LuArrowUp className='w-5 h-5' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-56'>
        <div className='space-y-4'>
          {showOverrideSwitches.split(',').includes('tts') && <OverrideSwitch name='tts' label='Text-to-Speech' />}
          {showOverrideSwitches.split(',').includes('websearch') && <OverrideSwitch name='websearch' label='Websearch' />}
          {showOverrideSwitches.split(',').includes('create-image') && (
            <OverrideSwitch name='create-image' label='Generate an Image' />
          )}
          {showOverrideSwitches.split(',').includes('analyze-user-input') && (
            <OverrideSwitch name='analyze-user-input' label='Analyze' />
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export const UploadFiles = ({ handleUploadFiles, message, uploadedFiles, disabled }: any) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <>
            <Button
              size='icon'
              variant='ghost'
              className='rounded-full'
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <LuPaperclip className='w-5 h-5 ' />
            </Button>
            <label id='trigger-file-upload' htmlFor='file-upload' className='hidden'>
              Upload files
            </label>
            <input
              id='file-upload'
              type='file'
              multiple
              className='hidden'
              onChange={handleUploadFiles}
              disabled={disabled}
            />
          </>
        </TooltipTrigger>
        <TooltipContent>Send Message</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const SendMessage = ({ handleSend, message, uploadedFiles, disabled }: any) => {
  return (
    <TooltipBasic title='Send Message' side='left'>
      <Button
        id='send-message'
        onClick={(event) => {
          event.preventDefault();
          handleSend(message, uploadedFiles);
        }}
        disabled={(message.trim().length === 0 && Object.keys(uploadedFiles).length === 0) || disabled}
        size='icon'
        variant='ghost'
        className='rounded-full'
      >
        <LuSend className='w-5 h-5' />
      </Button>
    </TooltipBasic>
  );
};

export const ResetConversation = ({ state, setCookie }: any) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' size='icon'>
          <LuTrash2 className='w-4 h-4' />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset Conversation</DialogTitle>
          <DialogDescription>Are you sure you want to reset the conversation? This cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={() => {
              const uuid = crypto.randomUUID();
              setCookie('uuid', uuid, { domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN, maxAge: 2147483647 });
              state.mutate((oldState: any) => ({
                ...oldState,
                overrides: { ...oldState.overrides, conversation: uuid },
              }));
            }}
          >
            Reset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const ThemeToggles = (): ReactNode => {
  return (
    <div className='flex flex-col items-center'>
      <SwitchDark />
      <SwitchColorblind />
    </div>
  );
};

export const ListUploadedFiles = ({ uploadedFiles, setUploadedFiles }: any): ReactNode => {
  return (
    <div className='flex flex-wrap items-center gap-2'>
      <span className='text-sm text-muted-foreground'>Uploaded Files:</span>
      {Object.entries(uploadedFiles).map(([fileName]) => (
        <Badge
          key={fileName}
          variant='outline'
          className='py-1 cursor-pointer bg-muted'
          onClick={() => {
            setUploadedFiles((prevFiles: any) => {
              const newFiles = { ...prevFiles };
              delete newFiles[String(fileName)];
              return newFiles;
            });
          }}
        >
          {fileName}
        </Badge>
      ))}
    </div>
  );
};
