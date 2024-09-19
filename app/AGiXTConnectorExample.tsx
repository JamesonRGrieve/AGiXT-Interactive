import { AGiXTConfigContext, AGiXTConfig } from '@/types/AGiXTConfigContext';
import AGiXTSDK from 'agixt';
import OpenAI from 'openai';
import { useState } from 'react';

export type ServerProps = {
  apiKey: string;
  agixtServer: string;
};
export default function AGiXTConnectorExample({ serverInfo, children }: { serverInfo: ServerProps; children: any }) {
  const agixt: AGiXTSDK = new AGiXTSDK({
    baseUri: serverInfo.agixtServer,
    apiKey: serverInfo.apiKey,
  });
  const openai: OpenAI = new OpenAI({
    apiKey: serverInfo.apiKey.replace('Bearer ', ''),
    baseURL: serverInfo.agixtServer + '/v1',
    dangerouslyAllowBrowser: true,
  });
  const [InteractiveConfigState, setInteractiveConfigState] = useState<AGiXTConfig>({
    agixt: agixt,
    openai: openai,
    mutate: null,
  } as AGiXTConfig);
  return (
    <AGiXTConfigContext.Provider
      value={{ ...InteractiveConfigState, agixt: agixt, openai: openai, mutate: setInteractiveConfigState }}
    >
      {children}
    </AGiXTConfigContext.Provider>
  );
}
