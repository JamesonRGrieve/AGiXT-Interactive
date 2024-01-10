import React, { useEffect, useState, ReactNode } from 'react';
import { ChatContext, ChatDefaultState, ChatState } from '../types/ChatState';

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
  initialState?: ChatState;
  children: ReactNode;
}) {
  // Used to determine whether to render the app or not (populates with any fetch errors from tryFetch calls).
  const [errors, setErrors] = useState<any[]>([]);
  const tryFetch = async (fetchFunction: any) => {
    try {
      await fetchFunction();
    } catch (e: any) {
      console.log(e);
      setErrors((errors) => [...errors, e.message]);
    }
  };
  const [ChatState, setChatState] = useState<ChatState>({
    // Default state and initializes the SDK
    ...ChatDefaultState,
    ...initialState,
    // Overridden in context provider.
    mutate: null
  } as ChatState);
  const sdk: AGiXTSDK = new AGiXTSDK({
    baseUri: agixtServer,
    apiKey: apiKey
  });
  useEffect(() => {
    console.log('AGiXT Active Agent Changed', ChatState.chatConfig.selectedAgent);
    tryFetch(async () => {
      console.log('Fetching Conversations!');
      await sdk.getConversations(ChatState.chatConfig.selectedAgent).then((conversations: any) => {
        console.log('Retrieved new conversations.', conversations);
        setChatState((oldState) => {
          return { ...oldState, conversations: conversations };
        });
        console.log('Fetched Conversations!');
      });
    });
  }, [ChatState.chatConfig.selectedAgent]);
  return errors.length > 0 ? (
    <>
      <h1>Error in AGiXT SDK</h1>

      <p>Please check your API Key and AGiXT Server URL</p>

      <ul>
        {errors.map((error) => {
          return <li key={error.message}>{error.message}</li>;
        })}
      </ul>
    </>
  ) : (
    <ChatContext.Provider value={{ ...ChatState, sdk: sdk, mutate: setChatState }}>{children}</ChatContext.Provider>
  );
}
