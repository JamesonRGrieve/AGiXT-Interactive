'use client';
import { useEffect, useState, ReactNode, useContext } from 'react';
import { AGiXTChatContext, AGiXTChatDefaultState, AGiXTChatState } from '../types/AGiXTChatState';
import React from 'react';
import { AGiXTContext } from 'agixt-react';
export default function AGiXTWrapper({
  initialState = {},
  children
}: {
  initialState?: any;
  children: ReactNode;
}) {
  // Used to determine whether to render the app or not (populates with any fetch errors from tryFetch calls).
  const state = useContext(AGiXTContext);
  const [errors, setErrors] = useState<any[]>([]);
  const tryFetch = async (fetchFunction: any) => {
    try {
      await fetchFunction();
    } catch (e: any) {
      console.log(e);
      setErrors((errors) => [...errors, e.message]);
    }
  };
  const [AGiXTChatState, setAGiXTChatState] = useState<AGiXTChatState>({
    // Default state and initializes the SDK
    ...AGiXTChatDefaultState,
    ...initialState,
    // Overridden in context provider.
    mutate: null
  } as AGiXTChatState);

  useEffect(() => {
    console.log('AGiXT Active Agent Changed', AGiXTChatState.chatConfig.selectedAgent);
    tryFetch(async () => {
      console.log('Fetching Conversations!');
      await state.sdk.getConversations(AGiXTChatState.chatConfig.selectedAgent).then((conversations: any) => {
        console.log('Retrieved new conversations.', conversations);
        setAGiXTChatState((oldState) => {
          return { ...oldState, conversations: conversations };
        });
        console.log('Fetched Conversations!');
      });
    });
  }, [AGiXTChatState.chatConfig.selectedAgent, state.sdk]);
  return errors.length > 0 ? (<>

        <h1>Error in AGiXT SDK</h1>

      <p>
        Please check your API Key and AGiXT Server URL</p>

      <ul>
        {errors.map((error) => {
          return (
            <li key={error.message}>

                {error.message}

            </li>
          );
        })}
      </ul>
      </>
  ) : (
    <AGiXTChatContext.Provider value={{ ...AGiXTChatState, mutate: setAGiXTChatState }}>{children}</AGiXTChatContext.Provider>
  );
}
