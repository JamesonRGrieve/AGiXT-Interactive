'use client';
import React, { useState, ReactNode, useEffect } from 'react';
import OpenAI from 'openai';
import { getCookie } from 'cookies-next';
import { InteractiveConfigContext, InteractiveConfigDefault, InteractiveConfig } from './InteractiveConfigContext';
import AGiXTSDK from '@/lib/sdk';
import log from '../jrg/next-log/log';

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
    log(
      [InteractiveConfigDefault],
      {
        client: 2,
      },
      'Default Config Provided',
    );
    log(
      [initialState],
      {
        client: 2,
      },
      'Initial State Provided',
    );
    log(
      [
        {
          ...InteractiveConfigDefault,
          ...initialState,
          // Overridden in context provider.
          mutate: null,
        },
      ],

      {
        client: 1,
      },
      'Booting State With',
    );
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

  log([`Context Wrapper initializing AGiXTSDK and OpenAI with baseUri ${agixtServer} and apiKey ${apiKey}.`], {
    client: 1,
  });

  return (
    <InteractiveConfigContext.Provider
      value={{ ...InteractiveConfigState, agixt: agixt, openai: openai, mutate: setInteractiveConfigState }}
    >
      {children}
    </InteractiveConfigContext.Provider>
  );
}
