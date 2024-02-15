'use client';
import React, { useState, ReactNode } from 'react';
import AGiXTSDK from 'agixt';
import { ChatContext, ChatDefaultConfig, ChatConfig } from '../types/ChatContext';

export default function ChatContextWrapper({
  initialState = ChatDefaultConfig,
  requireKey = false,
  apiKey = null,
  agixtServer = '',
  children,
}: {
  requireKey?: boolean;
  apiKey?: string;
  agixtServer?: string;
  initialState?: ChatConfig;
  children: ReactNode;
}) {
  console.log('Default Config Provided:', ChatDefaultConfig);
  console.log('Initial State Provided:', initialState);
  console.log('Booting State With:', {
    ...ChatDefaultConfig,
    ...initialState,
    // Overridden in context provider.
    mutate: null,
  });

  // Used to determine whether to render the app or not (populates with any fetch errors from tryFetch calls).
  const [ChatState, setChatState] = useState<ChatConfig>({
    // Default state and initializes the SDK
    ...ChatDefaultConfig,
    ...initialState,
    // Overridden in context provider.
    mutate: null,
  } as ChatConfig);
  const sdk: AGiXTSDK = new AGiXTSDK({
    baseUri: agixtServer,
    apiKey: apiKey,
  });
  return <ChatContext.Provider value={{ ...ChatState, sdk: sdk, mutate: setChatState }}>{children}</ChatContext.Provider>;
}
