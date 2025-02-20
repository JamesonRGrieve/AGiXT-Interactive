'use client';

import { createContext, useContext, type ReactNode } from 'react';

export type ChatInputContextType = {
  onSend: (message: string | object, uploadedFiles?: { [x: string]: string }) => Promise<string>;
  disabled: boolean;
  showChatThemeToggles: boolean;
  enableFileUpload: boolean;
  enableVoiceInput: boolean;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  showOverrideSwitchesCSV: string;
  showResetConversation: boolean;
};

const ChatInputContext = createContext<ChatInputContextType | undefined>(undefined);

type ChatInputProviderProps = ChatInputContextType & {
  children: ReactNode;
};

export function ChatInputProvider({ children, ...props }: ChatInputProviderProps) {
  return <ChatInputContext.Provider value={props}>{children}</ChatInputContext.Provider>;
}

export function useChatInput() {
  const context = useContext(ChatInputContext);

  if (context === undefined) {
    throw new Error('useChatInput must be used within a ChatInputProvider');
  }

  return context;
}
