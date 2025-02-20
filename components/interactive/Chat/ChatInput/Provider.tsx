'use client';

import { createContext, useContext, type ReactNode } from 'react';

type ChatInputContextType = {
  // Add state types here later
};

const ChatInputContext = createContext<ChatInputContextType | undefined>(undefined);

export function ChatInputProvider({ children }: { children: ReactNode }) {
  return (
    <ChatInputContext.Provider
      value={
        {
          // Add state and handlers here later
        }
      }
    >
      {children}
    </ChatInputContext.Provider>
  );
}

export function useChatInput() {
  const context = useContext(ChatInputContext);

  if (context === undefined) {
    throw new Error('useChatInput must be used within a ChatInputProvider');
  }

  return context;
}
