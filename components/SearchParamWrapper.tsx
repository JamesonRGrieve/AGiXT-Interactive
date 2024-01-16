'use client';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { ChatConfig } from '../types/ChatContext';
import AGiXTChat from './AGiXTChat';

const SearchParamWrapper = (mode?, showAppBar = false, showConversationSelector = false) => {
  const searchParams = useSearchParams();
  return (
    <AGiXTChat
      stateful
      mode={
        ['prompt', 'chain'].includes(searchParams.get('mode'))
          ? (searchParams.get('mode') as 'prompt' | 'chain')
          : mode || 'prompt'
      }
      showAppBar={showAppBar}
      showConversationSelector={showConversationSelector}
      opts={
        {
          chatSettings: {
            selectedAgent: searchParams.get('agent') || undefined,
            contextResults: Number(searchParams.get('contextResults')) || undefined,
            shots: Number(searchParams.get('shots')) || undefined,
            websearchDepth: Number(searchParams.get('websearchDepth')) || undefined,
            injectMemoriesFromCollectionNumber: Number(searchParams.get('injectMemoriesFromCollectionNumber')) || undefined,
            conversationResults: Number(searchParams.get('results')) || undefined,
            conversationName: searchParams.get('conversation') || undefined,
            browseLinks: Boolean(searchParams.get('browseLinks')) || undefined,
            webSearch: Boolean(searchParams.get('webSearch')) || undefined,
            insightAgentName: searchParams.get('insightAgent') || undefined,
            enableMemory: Boolean(searchParams.get('memory')) || undefined,
            enableFileUpload: Boolean(searchParams.get('fileUpload')) || undefined,
            useSelectedAgent: Boolean(searchParams.get('useSelectedAgent')) || undefined,
            chainRunConfig: {
              chainArgs: JSON.parse(searchParams.get('chainArgs')) || undefined,
              singleStep: Boolean(searchParams.get('singleStep')) || undefined,
              fromStep: Number(searchParams.get('fromStep')) || undefined,
              allResponses: Boolean(searchParams.get('allResponses')) || undefined,
            },
          },
          prompt: searchParams.get('prompt') || undefined,
          promptCategory: searchParams.get('promptCategory') || undefined,
          conversationName: searchParams.get('conversationName') || undefined,
          chain: searchParams.get('chain') || undefined,
          conversations: undefined,
          mutate: undefined,
          chatState: undefined,
          sdk: undefined,
        } as ChatConfig
      }
    />
  );
};

export default SearchParamWrapper;
