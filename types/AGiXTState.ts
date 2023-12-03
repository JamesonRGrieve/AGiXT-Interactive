import { Context, createContext } from 'react';

export type Extension = {
  name: string;
  settings: object;
};
export type Agent = {
  name: string;
  commands: object;
  settings: object;
};
export type Conversation = {
  name: string;
  messages: Message[];
};
export type Message = {
  role: string;
  content: string;
  timestamp: Date;
};
export type TrainingConfig = {
  collectionNumber: number;
  limit: number;
  minRelevanceScore: number;
};
export type ChainRunConfig = {
  selectedChain: string;
  chainArgs: object;
  singleStep: boolean;
  fromStep: number;
  allResponses: boolean;
  useSelectedAgent: boolean;
};
export type PromptConfig = {
  promptName: string;
  promptCategory: string;
  promptArgs: object;
  useSelectedAgent: boolean;
};
export type ChatConfig = {
  contextResults: number;
  shots: number;
  websearchDepth: number;
  injectMemoriesFromCollectionNumber: number;
  conversationResults: number;
  conversationName: string;
  browseLinks: boolean;
  webSearch: boolean;
  insightAgentName: string;
  enableMemory: boolean;
  enableFileUpload: boolean;
  chainRunConfig: ChainRunConfig;
  promptConfig: PromptConfig
};
export type ChatState = {
  conversation: object;
  hasFiles: boolean;
  lastResponse: object;
  uploadedFiles: File[];
  isLoading: boolean;
};
export type AGiXTState = {
  // Global State Here
  agent: Agent; // Active agent.
  agents: string[]; // List of agent names.
  extensions: Extension[]; // List of extensions.
  llms: object[]; // List of LLMs.
  providers: string[]; // List of agent names.
  chains: string[]; // List of chain names.
  prompts: string[]; // List of prompt names.
  promptCategories: string[]; // List of prompt categories.
  conversations: string[]; // List of conversations.
  trainingConfig: TrainingConfig;
  chatConfig: ChatConfig;
  chatState: ChatState;
  sdk: any;
  //message: string;
  mutate: any;
};
export const AGiXTContext: Context<AGiXTState> = createContext<AGiXTState>({
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
    uploadedFiles: [],
    isLoading: false
  },
  sdk: null,
  //message: '',
  mutate: null
});
