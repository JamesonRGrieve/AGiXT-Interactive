import { Context, createContext } from 'react';

export type ChainRunConfig = {
  chainArgs: object;
  singleStep: boolean;
  fromStep: number;
  allResponses: boolean;
};
export type ChatSettings = {
  selectedAgent: string;
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
export type Chat = {
  conversation: ChatItem[];
  hasFiles: boolean;
  lastResponse: object;
  uploadedFiles: File[];
  isLoading: boolean;
};
export type ChatConfig = {
  chatSettings: ChatSettings;
  chatState: Chat;
  conversations: string[]; // TODO Refactor all references to this into SWR. List of conversations.
  prompt: string;
  promptCategory: string;
  chain: string;
  //message: string;
  mutate: any;
  sdk: any;
};

export const ChatDefaultConfig = {
  conversations: [],
  chatSettings: {
    selectedAgent: process.env.NEXT_PUBLIC_AGENT_NAME || 'gpt4free', 
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
      allResponses: false,
    },
  },
  chatState: {
    conversation: [],
    hasFiles: false,
    lastResponse: {},
    uploadedFiles: [],
    isLoading: false,
  },
  prompt: '',
  promptCategory: '',
  chain: '',
  //message: '',
  mutate: null,
  sdk: null,
};
export const ChatContext: Context<ChatConfig> = createContext<ChatConfig>(ChatDefaultConfig);
