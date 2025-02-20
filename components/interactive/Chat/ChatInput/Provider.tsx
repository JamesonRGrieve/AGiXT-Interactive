'use client';

import { createContext, useContext, type ReactNode, useState } from 'react';
import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/markdown',
] as const;

const FileSchema = z.object({
  name: z.string().min(1),
  size: z.number().max(MAX_FILE_SIZE, 'File size must be less than 5MB'),
  type: z.enum([...ACCEPTED_FILE_TYPES] as [string, ...string[]]),
});

const FileReaderResultSchema = z.object({
  target: z
    .object({
      result: z.string().min(1).startsWith('data:', 'Invalid file data format'),
    })
    .required(),
});

const UploadedFilesSchema = z.record(z.string().min(1), z.string().min(1).startsWith('data:'));

export type UploadedFiles = z.infer<typeof UploadedFilesSchema>;

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
    const fileValidation = FileSchema.safeParse(file);
    if (!fileValidation.success) {
      console.error('File validation failed:', fileValidation.error);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (!e.target || typeof e.target.result !== 'string') return;

      const result = FileReaderResultSchema.safeParse({ target: { result: e.target.result } });

      if (result.success) {
        setUploadedFiles((prev) => {
          const newFiles = {
            ...prev,
            [file.name]: result.data.target.result,
          };

          const filesValidation = UploadedFilesSchema.safeParse(newFiles);
          if (!filesValidation.success) {
            console.error('Uploaded files validation failed:', filesValidation.error);
            return prev;
          }

          return newFiles;
        });
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
      setMessage('');
      setUploadedFiles({});
      await onSend(message, uploadedFiles);
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
