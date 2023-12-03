'use client';
import AGiXTSDK from 'agixt';
import { useEffect, useState, ReactNode } from 'react';
import { AGiXTContext, AGiXTState } from '@/types/AGiXTState';
import './globals.css';
export default function AGiXTWrapper({ apiKey, children }: { apiKey?: string; children: ReactNode }) {
  const [AGiXTState, setAGiXTState] = useState<AGiXTState>({
    // Global State Here
    agent: {
      name: '',
      commands: {},
      settings: {}
    },
    agents: [],
    extensions: [],
    llms: [],
    providers: [],
    chains: [],
    prompts: [],
    promptCategories: [],
    conversations: [],
    trainingConfig: {
      collectionNumber: 0,
      limit: 0,
      minRelevanceScore: 0
    },
    chatConfig: {
      contextResults: 0,
      shots: 0,
      websearchDepth: 0,
      injectMemoriesFromCollectionNumber: 0,
      conversationResults: 5,
      conversationName: '',
      browseLinks: false,
      webSearch: false,
      insightAgentName: '',
      enableMemory: false,
      enableFileUpload: false,
      chainRunConfig: {
        selectedChain: '',
        chainArgs: {},
        singleStep: false,
        fromStep: 0,
        allResponses: false,
        useSelectedAgent: true
      },
      promptConfig: {
        promptName: '',
        promptCategory: '',
        promptArgs: {},
        useSelectedAgent: true
      },
    },
    chatState: {
      conversation: {},
      hasFiles: false,
      lastResponse: {},
      uploadedFiles: []
    },
    sdk: new AGiXTSDK({
      baseUri: process.env.NEXT_PUBLIC_API_URI || 'http://localhost:7437',
      apiKey: apiKey || process.env.NEXT_PUBLIC_API_KEY || ''
    }),
    //message: '',
    mutate: null
  } as AGiXTState);
  useEffect(() => {
    console.log('AGiXT Initialized');
    console.log('Fetching AGiXT Agents');
    (async () => {
      await AGiXTState.sdk.getAgents().then((agents) => {
        console.log('Completed AGiXT Agent Fetch, Setting State');
        setAGiXTState((previousState: AGiXTState) => {
          return { ...previousState, agents: agents.map((agent) => agent.name) };
        });
        console.log('Sent State Update Request');
      });
    })();
  }, [AGiXTState.sdk]);
  useEffect(() => {
    console.log('AGiXT Active Agent Changed', AGiXTState.agent);
  }, [AGiXTState.agent]);
  // TODO: Do this when agents load:
  /*
    agents.sort((a, b) => {
    let nameA = typeof a.name === 'string' ? a.name.trim().toLowerCase() : '';
    let nameB = typeof b.name === 'string' ? b.name.trim().toLowerCase() : '';
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });
  */
  return (
    <AGiXTContext.Provider value={{ ...AGiXTState, mutate: setAGiXTState }}>
      {children}
      {/*
      <Collapse in={Boolean(AGiXTState.message)}>
        <Alert severity='info'>{AGiXTState.message}</Alert>
      </Collapse>
    */}
    </AGiXTContext.Provider>
  );
}
