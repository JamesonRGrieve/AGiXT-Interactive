import React, { useState } from 'react';
import AGiXTSDK from 'agixt';
import OpenAI from 'openai';
import { InteractiveConfigContext, InteractiveConfigDefault, InteractiveConfig } from '../types/InteractiveConfigContext';

const mockState = {
  agent: 'mock-agent',
  overrides: {
    conversationName: 'mock-conversation',
  },
  agixt: new AGiXTSDK({ baseUri: 'http://mock-server', apiKey: 'mock-api-key' }),
  openai: new OpenAI({ apiKey: 'mock-api-key', baseURL: 'http://mock-server/v1', dangerouslyAllowBrowser: true }),
};

export const MockInteractiveConfigProvider = ({ children }) => {
  const [InteractiveConfigState, setInteractiveConfigState] = useState<InteractiveConfig>({
    ...InteractiveConfigDefault,
    ...mockState,
    mutate: null,
  });

  InteractiveConfigState.mutate = setInteractiveConfigState;

  return <InteractiveConfigContext.Provider value={InteractiveConfigState}>{children}</InteractiveConfigContext.Provider>;
};
