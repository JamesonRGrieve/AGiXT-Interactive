'use client';

import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { CheckCircle as LuCheckCircle } from 'lucide-react';
import { LuPaperclip, LuSend, LuArrowUp, LuLoader, LuTrash2 } from 'react-icons/lu';
import { setCookie } from 'cookies-next';
import { InteractiveConfigContext } from '../InteractiveConfigContext';
import { VoiceRecorder } from './VoiceRecorder';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
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
import { DropZone } from '@/components/jrg/dropzone/DropZone';
import SwitchDark from '@/components/jrg/theme/SwitchDark';
import SwitchColorblind from '@/components/jrg/theme/SwitchColorblind';

export default function ChatBar({
  onSend,
  disabled,
  loading,
  setLoading,
  clearOnSend = true,
  showChatThemeToggles = false,
  enableFileUpload = false,
  enableVoiceInput = false,
  showResetConversation = false,
  showOverrideSwitchesCSV = '',
}: {
  onSend: (message: string | object, uploadedFiles?: { [x: string]: string }) => Promise<string>;
  disabled: boolean;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  clearOnSend?: boolean;
  showChatThemeToggles: boolean;
  enableFileUpload?: boolean;
  enableVoiceInput?: boolean;
  showResetConversation?: boolean;
  showOverrideSwitchesCSV?: string;
}): ReactNode {
  const state = useContext(InteractiveConfigContext);
  const [timer, setTimer] = useState<number>(-1);
  const [uploadedFiles, setUploadedFiles] = useState<{ [x: string]: string }>({});
  const [message, setMessage] = useState('');
  const [alternativeInputActive, setAlternativeInputActive] = useState(false);

  const handleUploadFiles = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    if (event.target.files) {
      for (const file of event.target.files) {
        await uploadFile(file);
      }
    }
  };

  const uploadFile = async (file: File) => {
    const newUploadedFiles: { [x: string]: string } = {};
    const fileContent = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = (): void => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    newUploadedFiles[file.name] = fileContent;
    setUploadedFiles((previous) => ({ ...previous, ...newUploadedFiles }));
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      setTimer(0);
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 100);
    }
    return () => {
      clearInterval(interval);
    };
  }, [loading]);

  return (
    <DropZone onUpload={(files: File[]) => files.map((file) => uploadFile(file))}>
      <div className='flex items-center justify-between gap-2 p-4 bg-background'>
        <Textarea
          placeholder='Enter your message here...'
          id='message'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={async (event) => {
            if (event.key === 'Enter' && !event.shiftKey && message) {
              event.preventDefault();
              await onSend(message, uploadedFiles);
              setMessage('');
            }
          }}
          disabled={disabled}
          className='resize-none'
        />

        <div className='flex items-center space-x-2'>
          {timer > -1 && <Timer loading={loading} timer={timer} />}
          {showOverrideSwitchesCSV && <OverrideSwitches showOverrideSwitches={showOverrideSwitchesCSV} />}
          {enableFileUpload && !alternativeInputActive && (
            <UploadFiles
              handleUploadFiles={handleUploadFiles}
              message={message}
              uploadedFiles={uploadedFiles}
              disabled={disabled}
            />
          )}

          {enableVoiceInput && <VoiceRecorder onSend={onSend} disabled={disabled} />}
        </div>
        <div className='flex items-center space-x-2'>
          {showResetConversation && <ResetConversation state={state} setCookie={setCookie} />}
          {showChatThemeToggles && <ThemeToggles />}
          {!alternativeInputActive && (
            <SendMessage
              handleSend={() => {
                if (clearOnSend) {
                  setMessage('');
                  setUploadedFiles({});
                }
                onSend(message, uploadedFiles);
              }}
              message={message}
              uploadedFiles={uploadedFiles}
              disabled={disabled}
            />
          )}
        </div>

        {Object.keys(uploadedFiles).length > 0 && (
          <ListUploadedFiles uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} />
        )}
      </div>
    </DropZone>
  );
}

const Timer = ({ loading, timer }: { loading: boolean; timer: number }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className='flex items-center space-x-1'>
          <span className='text-sm'>{(timer / 10).toFixed(1)}s</span>
          {loading ? <LuLoader className='animate-spin' /> : <LuCheckCircle className='text-green-500' />}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        {loading
          ? `Your most recent interaction has been underway (including all activities) for ${(timer / 10).toFixed(1)} seconds.`
          : `Your last interaction took ${(timer / 10).toFixed(1)} seconds to completely resolve.`}
      </TooltipContent>
    </Tooltip>
  );
};

const UploadFiles = ({ handleUploadFiles, message, uploadedFiles, disabled }: any) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Button size='icon' onClick={() => document.getElementById('file-upload')?.click()}>
          <LuPaperclip />
        </Button>
        <label id='trigger-file-upload' htmlFor='file-upload' className='hidden' />
        <input id='file-upload' type='file' multiple className='hidden' onChange={handleUploadFiles} disabled={disabled} />
      </TooltipTrigger>
      <TooltipContent>Upload Files</TooltipContent>
    </Tooltip>
  );
};

const SendMessage = ({ handleSend, message, uploadedFiles, disabled }: any) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Button
          id='send-message'
          onClick={(event) => {
            event.preventDefault();
            handleSend(message, uploadedFiles);
          }}
          disabled={(message.trim().length === 0 && Object.keys(uploadedFiles).length === 0) || disabled}
          size='icon'
        >
          <LuSend className='w-4 h-4' />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Send Message</TooltipContent>
    </Tooltip>
  );
};

const ResetConversation = ({ state, setCookie }: any) => {
  return (
    <Dialog>
      <DialogTrigger>
        <Tooltip>
          <TooltipTrigger>
            <Button variant='outline' size='icon'>
              <LuTrash2 className='w-4 h-4' />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Reset Conversation</TooltipContent>
        </Tooltip>
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

const ThemeToggles = (): ReactNode => {
  return (
    <div className='flex flex-col items-center'>
      <SwitchDark />
      <SwitchColorblind />
    </div>
  );
};

const ListUploadedFiles = ({ uploadedFiles, setUploadedFiles }: any): ReactNode => {
  return (
    <div className='flex flex-wrap gap-2 mt-2'>
      <span className='text-sm text-muted-foreground'>Uploaded Files:</span>
      {Object.entries(uploadedFiles).map(([fileName]) => (
        <Badge
          key={fileName}
          variant='secondary'
          className='cursor-pointer'
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
