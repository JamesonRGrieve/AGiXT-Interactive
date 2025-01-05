'use client';
import React, { useState, ReactNode, useEffect } from 'react';
import AGiXTSDK from 'agixt';
import OpenAI from 'openai';
import { InteractiveConfigContext, InteractiveConfigDefault, InteractiveConfig } from './InteractiveConfigContext';
import { getCookie } from 'cookies-next';

export default function InteractiveConfigContextWrapper({
  initialState = InteractiveConfigDefault,
  apiKey = getCookie('jwt') || '',
  agixtServer = process.env.NEXT_PUBLIC_AGIXT_SERVER,
  children,
}: {
  requireKey?: boolean;
  apiKey?: string;
  agixtServer?: string;
  initialState?: InteractiveConfig;
  children: ReactNode;
}): React.JSX.Element {
  if (process.env.NEXT_PUBLIC_ENV === 'development') {
    console.log('Default Config Provided:', InteractiveConfigDefault);
    console.log('Initial State Provided:', initialState);
    console.log('Booting State With:', {
      ...InteractiveConfigDefault,
      ...initialState,
      // Overridden in context provider.
      mutate: null,
    });
  }
  const agixt: AGiXTSDK = new AGiXTSDK({
    baseUri: agixtServer,
    apiKey: apiKey,
  });
  const openai: OpenAI = new OpenAI({
    apiKey: apiKey.replace('Bearer ', ''),
    baseURL: agixtServer + '/v1',
    dangerouslyAllowBrowser: true,
  });
  // Used to determine whether to render the app or not (populates with any fetch errors from tryFetch calls).
  const [InteractiveConfigState, setInteractiveConfigState] = useState<InteractiveConfig>({
    // Default state and initializes the SDK
    ...InteractiveConfigDefault,
    ...initialState,
    // Overridden in context provider.
    agixt: agixt,
    openai: openai,
    mutate: null,
  } as InteractiveConfig);

  if (process.env.NEXT_PUBLIC_ENV === 'development') {
    console.log(
      'Context Wrapper initializing AGiXTSDK and OpenAI with baseUri/apiKey: ',
      agixtServer,
      apiKey,
      agixt,
      openai,
      InteractiveConfigState,
    );
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      console.log('State changed to...', InteractiveConfigState);
    }, [InteractiveConfigState]);
  }
  return (
    <InteractiveConfigContext.Provider
      value={{ ...InteractiveConfigState, agixt: agixt, openai: openai, mutate: setInteractiveConfigState }}
    >
      {children}
    </InteractiveConfigContext.Provider>
  );
}
