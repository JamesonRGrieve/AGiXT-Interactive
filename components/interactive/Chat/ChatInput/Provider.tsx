'use client';

import { createContext, useContext, type ReactNode, useState } from 'react';
import { z } from 'zod';

const FileReaderResultSchema = z.object({
  target: z
    .object({
      result: z.string().min(1),
    })
    .required(),
});

export type UploadedFiles = { [fileName: string]: string };

export type ChatInputContextType = {
  onSend: (message: string | object, uploadedFiles?: UploadedFiles) => Promise<string>;
  disabled: boolean;
  showChatThemeToggles: boolean;
  enableFileUpload: boolean;
  enableVoiceInput: boolean;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  showOverrideSwitchesCSV: string;
  showResetConversation: boolean;
  message: string;
  setMessage: (message: string) => void;
  uploadedFiles: UploadedFiles;
  addFile: (file: File) => Promise<void>;
  removeFile: (fileName: string) => void;
  handleSendMessage: () => Promise<void>;
};

const ChatInputContext = createContext<ChatInputContextType | undefined>(undefined);

type ChatInputProviderProps = Omit<
  ChatInputContextType,
  'message' | 'setMessage' | 'uploadedFiles' | 'addFile' | 'removeFile' | 'handleSendMessage'
> & {
  children: ReactNode;
};

export function ChatInputProvider({ children, onSend, ...props }: ChatInputProviderProps) {
  const [message, setMessage] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles>({});

  const addFile = async (file: File) => {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (!e.target || typeof e.target.result !== 'string') return;

      const result = FileReaderResultSchema.safeParse({ target: { result: e.target.result } });

      if (result.success) {
        setUploadedFiles((prev) => ({
          ...prev,
          [file.name]: result.data.target.result,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const removeFile = (fileName: string) => {
    setUploadedFiles((prev) => {
      const newFiles = { ...prev };
      delete newFiles[fileName];
      return newFiles;
    });
  };

  const handleSendMessage = async () => {
    if (!message.trim() && Object.keys(uploadedFiles).length === 0) return;

    try {
      await onSend(message, uploadedFiles);
      setMessage('');
      setUploadedFiles({});
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const value = {
    ...props,
    onSend,
    message,
    setMessage,
    uploadedFiles,
    addFile,
    removeFile,
    handleSendMessage,
  };

  return <ChatInputContext.Provider value={value}>{children}</ChatInputContext.Provider>;
}

export function useChatInput() {
  const context = useContext(ChatInputContext);

  if (context === undefined) {
    throw new Error('useChatInput must be used within a ChatInputProvider');
  }

  return context;
}
