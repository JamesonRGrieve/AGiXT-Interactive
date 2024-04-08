'use client';
import React, { useState, ReactNode, useEffect } from 'react';
import AGiXTSDK from 'agixt';
import OpenAI from 'openai';
import { ChatContext, ChatDefaultConfig, ChatConfig } from '../types/ChatContext';

export default function ChatContextWrapper({
  initialState = ChatDefaultConfig,
  apiKey = null,
  agixtServer = '',
  children,
}: {
  requireKey?: boolean;
  apiKey?: string;
  agixtServer?: string;
  initialState?: ChatConfig;
  children: ReactNode;
}): React.JSX.Element {
  // console.log('Default Config Provided:', ChatDefaultConfig);
  // console.log('Initial State Provided:', initialState);
  // console.log('Booting State With:', {
  //   ...ChatDefaultConfig,
  //   ...initialState,
  //   // Overridden in context provider.
  //   mutate: null,
  // });
  const sdk: AGiXTSDK = new AGiXTSDK({
    baseUri: agixtServer,
    apiKey: apiKey,
  });
  const openai: OpenAI = new OpenAI({ apiKey: apiKey, baseURL: agixtServer + '/v1', dangerouslyAllowBrowser: true });
  // Used to determine whether to render the app or not (populates with any fetch errors from tryFetch calls).
  const [ChatState, setChatState] = useState<ChatConfig>({
    // Default state and initializes the SDK
    ...ChatDefaultConfig,
    ...initialState,
    // Overridden in context provider.
    sdk: sdk,
    openai: openai,
    mutate: null,
  } as ChatConfig);

  console.log(
    'Context Wrapper initializing AGiXTSDK and OpenAI with baseUri/apiKey: ',
    agixtServer,
    apiKey,
    sdk,
    openai,
    ChatState,
  );
  useEffect(() => {
    console.log('State changed to...', ChatState);
  }, [ChatState]);
  return (
    <ChatContext.Provider value={{ ...ChatState, sdk: sdk, openai: openai, mutate: setChatState }}>
      {children}
    </ChatContext.Provider>
  );
}
