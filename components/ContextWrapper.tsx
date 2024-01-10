import React, { useEffect, useState, ReactNode } from 'react';
import { ChatContext, ChatDefaultState, ChatConfig } from '../types/ChatContext';

import AGiXTSDK from 'agixt';

export default function ChatContextWrapper({
  initialState = ChatDefaultState,
  requireKey = false,
  apiKey = null,
  agixtServer = '',
  children
}: {
  requireKey?: boolean;
  apiKey?: string;
  agixtServer?: string;
  initialState?: ChatConfig;
  children: ReactNode;
}) {
  // Used to determine whether to render the app or not (populates with any fetch errors from tryFetch calls).
  const [ChatState, setChatState] = useState<ChatConfig>({
    // Default state and initializes the SDK
    ...ChatDefaultState,
    ...initialState,
    // Overridden in context provider.
    mutate: null
  } as ChatConfig);
  const sdk: AGiXTSDK = new AGiXTSDK({
    baseUri: agixtServer,
    apiKey: apiKey
  });
  return <ChatContext.Provider value={{ ...ChatState, sdk: sdk, mutate: setChatState }}>{children}</ChatContext.Provider>
}
