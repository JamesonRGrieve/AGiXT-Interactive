'use client';
import React, { useState, ReactNode, useEffect } from 'react';
import AGiXTSDK from 'agixt';
import OpenAI from 'openai';
import { ChatContext, ChatDefaultConfig, InteractiveConfig } from '../types/ChatContext';

export default function ChatContextWrapper({
  initialState = ChatDefaultConfig,
  apiKey = null,
  agixtServer = '',
  children,
}: {
  requireKey?: boolean;
  apiKey?: string;
  agixtServer?: string;
  initialState?: InteractiveConfig;
  children: ReactNode;
}): React.JSX.Element {
  if (process.env.NEXT_PUBLIC_MODE === 'development') {
    console.log('Default Config Provided:', ChatDefaultConfig);
    console.log('Initial State Provided:', initialState);
    console.log('Booting State With:', {
      ...ChatDefaultConfig,
      ...initialState,
      // Overridden in context provider.
      mutate: null,
    });
  }
  const sdk: AGiXTSDK = new AGiXTSDK({
    baseUri: agixtServer,
    apiKey: apiKey,
  });
  const openai: OpenAI = new OpenAI({
    apiKey: apiKey.replace('Bearer ', ''),
    baseURL: agixtServer + '/v1',
    dangerouslyAllowBrowser: true,
  });
  // Used to determine whether to render the app or not (populates with any fetch errors from tryFetch calls).
  const [ChatState, setChatState] = useState<InteractiveConfig>({
    // Default state and initializes the SDK
    ...ChatDefaultConfig,
    ...initialState,
    // Overridden in context provider.
    sdk: sdk,
    openai: openai,
    mutate: null,
  } as InteractiveConfig);

  if (process.env.NEXT_PUBLIC_MODE === 'development') {
    console.log(
      'Context Wrapper initializing AGiXTSDK and OpenAI with baseUri/apiKey: ',
      agixtServer,
      apiKey,
      sdk,
      openai,
      ChatState,
    );
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      console.log('State changed to...', ChatState);
    }, [ChatState]);
  }
  return (
    <ChatContext.Provider value={{ ...ChatState, sdk: sdk, openai: openai, mutate: setChatState }}>
      {children}
    </ChatContext.Provider>
  );
}
