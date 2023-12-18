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
  chainArgs: object;
  singleStep: boolean;
  fromStep: number;
  allResponses: boolean;
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
  useSelectedAgent: boolean;
  chainRunConfig: ChainRunConfig;
};
export type ChatItem = {
  role: string;
  message: string;
  timestamp: string;
};
export type ChatState = {
  conversation: ChatItem[];
  hasFiles: boolean;
  lastResponse: object;
  uploadedFiles: File[];
  isLoading: boolean;
};
export type ChainStep = {
  step: number;
  agentName: string;
  promptType: string;
  prompt: object;
};
export type Chain = {
  name: string;
  steps: ChainStep[];
};
export type Prompt = {
  name: string;
  category: string;
  body: string;
  args: object;
};
export type AGiXTState = {
  // Global State Here
  agent: Agent; // Active agent.
  agents: string[]; // List of agent names.
  extensions: Extension[]; // List of extensions.
  llms: object[]; // List of LLMs.
  providers: string[]; // List of agent names.
  chain: Chain; // Active chain.
  chains: string[]; // List of chain names.
  promptCategory: string; // Active prompt category.
  promptCategories: string[]; // List of prompt categories.
  prompt: Prompt; // Active prompt.
  prompts: string[]; // List of prompt names in active prompt category.
  conversations: string[]; // List of conversations.
  trainingConfig: TrainingConfig;
  chatConfig: ChatConfig;
  chatState: ChatState;
  sdk: any;
  //message: string;
  mutate: any;
};
export const AGiXTDefaultState = {
  agent: {
    name: '',
    commands: {},
    settings: {}
  },
  agents: [],
  extensions: [],
  llms: [],
  providers: [],
  chain: {
    name: '',
    steps: []
  },
  chains: [],
  promptCategory: 'Default',
  prompt: {
    name: '',
    category: '',
    body: '',
    args: {}
  },
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
    conversationName: 'Default',
    browseLinks: false,
    webSearch: false,
    insightAgentName: '',
    enableMemory: false,
    enableFileUpload: false,
    useSelectedAgent: true,
    chainRunConfig: {
      chainArgs: {},
      singleStep: false,
      fromStep: 0,
      allResponses: false
    }
  },
  chatState: {
    conversation: [],
    hasFiles: false,
    lastResponse: {},
    uploadedFiles: [],
    isLoading: false
  },
  sdk: null,
  //message: '',
  mutate: null
};
export const AGiXTContext: Context<AGiXTState> = createContext<AGiXTState>(AGiXTDefaultState);
