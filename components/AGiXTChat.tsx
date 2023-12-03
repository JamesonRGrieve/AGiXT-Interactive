import { AGiXTState } from '@/types/AGiXTState';
import { Theme } from '@mui/material';
import { getCookie } from 'cookies-next';
import { useState } from 'react';
import AGiXTSDK from 'agixt';
import Chat from './Chat';
export type ChatProps = {
  mode: 'chat' | 'prompt' | 'instruct' | 'chain';
  showAppBar: boolean;
  showConversationSelector: boolean;
  theme: Theme;
};
const Stateful = (props: ChatProps) => {
  const [AGiXTState, setAGiXTState] = useState<AGiXTState>({
    // Global State Here
    agent: {
      name: process.env.NEXT_PUBLIC_AGIXT_AGENT,
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
      conversationName: getCookie('conversationName') || process.env.NEXT_PUBLIC_AGIXT_CONVERSATION_NAME,
      browseLinks: false,
      webSearch: false,
      insightAgentName: process.env.NEXT_PUBLIC_AGIXT_INSIGHT_AGENT,
      enableMemory: false,
      enableFileUpload: process.env.NEXT_PUBLIC_AGIXT_FILE_UPLOAD_ENABLED === 'true',
      chainRunConfig: {
        selectedChain: process.env.NEXT_PUBLIC_AGIXT_CHAIN,
        chainArgs: JSON.parse(process.env.NEXT_PUBLIC_AGIXT_CHAIN_ARGS ?? '{}'),
        singleStep: false,
        fromStep: 0,
        allResponses: false,
        useSelectedAgent: process.env.NEXT_PUBLIC_AGIXT_USE_SELECTED_AGENT === 'true'
      },
      promptConfig: {
        promptName: process.env.NEXT_PUBLIC_AGIXT_PROMPT_NAME,
        promptCategory: process.env.NEXT_PUBLIC_AGIXT_PROMPT_CATEGORY,
        promptArgs: {},
        useSelectedAgent: true
      }
    },
    chatState: {
      conversation: [],
      hasFiles: false,
      lastResponse: {},
      uploadedFiles: [],
      isLoading: false
    },
    sdk: new AGiXTSDK({
      baseUri: process.env.NEXT_PUBLIC_API_URI || 'http://localhost:7437',
      apiKey: process.env.NEXT_PUBLIC_API_KEY || ''
    }),
    //message: '',
    mutate: null
  } as AGiXTState);
  return <Chat {...props} state={{ ...AGiXTState, mutate: setAGiXTState }} />;
};
const Stateless = ({ state, mode, showAppBar, showConversationSelector, theme }: ChatProps & { state: AGiXTState }) => {
  return (
    <Chat
      state={state}
      mode={mode}
      showAppBar={showAppBar}
      showConversationSelector={showConversationSelector}
      theme={theme}
    />
  );
};
const AGiXTChat = ({
  state,
  mode,
  showAppBar = false,
  showConversationSelector = false,
  theme
}: ChatProps & { state?: AGiXTState }) =>
  state ? (
    <Stateless
      state={state}
      mode={mode}
      showAppBar={showAppBar}
      showConversationSelector={showConversationSelector}
      theme={theme}
    />
  ) : (
    <Stateful mode={mode} showAppBar={showAppBar} showConversationSelector={showConversationSelector} theme={theme} />
  );
export default AGiXTChat;
