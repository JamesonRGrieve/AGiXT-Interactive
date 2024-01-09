import { Context, createContext } from "react";

export type ChainRunConfig = {
    chainArgs: object;
    singleStep: boolean;
    fromStep: number;
    allResponses: boolean;
};
export type ChatConfig = {
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
export type ChatState = {
    conversation: ChatItem[];
    hasFiles: boolean;
    lastResponse: object;
    uploadedFiles: File[];
    isLoading: boolean;
};
export type AGiXTChatState = {
    chatConfig: ChatConfig;
    chatState: ChatState;
    conversations: string[]; // TODO Refactor all references to this into SWR. List of conversations.
    //message: string;
    mutate: any;
}

export const AGiXTChatDefaultState = {
    conversations: [],
    chatConfig: {
      selectedAgent: 'gpt4free',
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
    //message: '',
    mutate: null
  };
  export const AGiXTChatContext: Context<AGiXTChatState> = createContext<AGiXTChatState>(AGiXTChatDefaultState);