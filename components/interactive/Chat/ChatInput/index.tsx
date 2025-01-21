'use client';

import React, { ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { setCookie } from 'cookies-next';
import { BiCollapseVertical } from 'react-icons/bi';
import { InteractiveConfigContext } from '../../InteractiveConfigContext';
import { VoiceRecorder } from '../VoiceRecorder';
import { ListUploadedFiles, OverrideSwitches, ResetConversation, SendMessage, Timer, UploadFiles } from './Adornments';
import { Textarea } from '@/components/ui/textarea';
import { DropZone } from '@/components/jrg/dropzone/DropZone';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TooltipBasic } from '@/components/ui/tooltip';

export default function ChatBar({
  onSend,
  disabled,
  loading,
  setLoading,
  clearOnSend = true,
  blurOnSend = true,
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
  blurOnSend?: boolean;
  showChatThemeToggles: boolean;
  enableFileUpload?: boolean;
  enableVoiceInput?: boolean;
  showResetConversation?: boolean;
  showOverrideSwitchesCSV?: string;
}): ReactNode {
  const state = useContext(InteractiveConfigContext);
  const [timer, setTimer] = useState<number>(-1);
  const [uploadedFiles, setUploadedFiles] = useState<{ [x: string]: string }>({});
  const [alternativeInputActive, setAlternativeInputActive] = useState(false);
  const {
    textareaRef,
    isActive,
    handleFocus,
    handleBlur,
    value: message,
    setValue: setMessage,
  } = useDynamicInput('', uploadedFiles);

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
    <DropZone
      onUpload={(files: File[]) => files.map((file) => uploadFile(file))}
      className={cn(
        'flex absolute bg-background bottom-0 items-center left-0 right-0 max-w-[95%] px-2 m-3 mx-auto border overflow-hidden shadow-md rounded-3xl',
        isActive && 'flex-col p-1',
      )}
    >
      {isActive ? (
        <label className='w-full' htmlFor='message'>
          <div className='w-full'>
            <Textarea
              ref={textareaRef}
              placeholder={loading ? 'Sending...' : 'Enter your message here...'}
              className='overflow-x-hidden overflow-y-auto border-none resize-none min-h-4 ring-0 focus-visible:ring-0 max-h-96'
              rows={1}
              name='message'
              id='message'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={async (event) => {
                if (event.key === 'Enter' && !event.shiftKey && message) {
                  event.preventDefault();
                  if (blurOnSend) {
                    handleBlur();
                  }

                  await onSend(message, uploadedFiles);
                  if (clearOnSend) {
                    setMessage('');
                    setUploadedFiles({});
                  }
                }
              }}
              disabled={disabled}
            />
          </div>
          <div className='flex items-center w-full gap-1'>
            {enableFileUpload && !alternativeInputActive && (
              <UploadFiles
                handleUploadFiles={handleUploadFiles}
                message={message}
                uploadedFiles={uploadedFiles}
                disabled={disabled}
              />
            )}
            {Object.keys(uploadedFiles).length > 0 && (
              <ListUploadedFiles uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} />
            )}
            <div className='flex-grow' />
            <TooltipBasic title='Collapse' side='top'>
              <Button size='icon' variant='ghost' className='rounded-full' onClick={() => handleBlur()}>
                <BiCollapseVertical className='w-4 h-4' />
              </Button>
            </TooltipBasic>
            {timer > -1 && <Timer loading={loading} timer={timer} />}
            {showOverrideSwitchesCSV && <OverrideSwitches showOverrideSwitches={showOverrideSwitchesCSV} />}
            {enableVoiceInput && <VoiceRecorder onSend={onSend} disabled={disabled} />}
            {showResetConversation && <ResetConversation state={state} setCookie={setCookie} />}
            {!alternativeInputActive && (
              <SendMessage
                handleSend={() => {
                  if (blurOnSend) {
                    handleBlur();
                  }
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
        </label>
      ) : (
        <>
          {enableFileUpload && !alternativeInputActive && (
            <UploadFiles
              handleUploadFiles={handleUploadFiles}
              message={message}
              uploadedFiles={uploadedFiles}
              disabled={disabled}
            />
          )}
          <Button
            id='message'
            size='lg'
            role='textbox'
            variant='ghost'
            className='justify-start w-full px-4 hover:bg-transparent'
            onClick={handleFocus}
          >
            <span className='font-light text-muted-foreground'>Enter your message here...</span>
          </Button>
          {enableVoiceInput && <VoiceRecorder onSend={onSend} disabled={disabled} />}
        </>
      )}
    </DropZone>
  );
}

export function useDynamicInput(initialValue = '', uploadedFiles: { [x: string]: string }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea || !isActive) return;

    const adjustHeight = () => {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    };

    textarea.addEventListener('input', adjustHeight);
    adjustHeight();

    return () => textarea.removeEventListener('input', adjustHeight);
  }, [isActive]);

  useEffect(() => {
    if (Object.keys(uploadedFiles).length > 0) {
      setIsActive(true);
    }
  }, [uploadedFiles]);

  const handleFocus = () => {
    setIsActive(true);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const handleBlur = () => {
    setIsActive(false);
  };

  return { textareaRef, isActive, handleFocus, handleBlur, value, setValue };
}
