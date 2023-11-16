import { Context, createContext } from 'react';

export type AGiXTState = {
  selectedChain?: string;
  chainArgs?: object;
  enableFileUpload?: boolean;
  contextResults?: number;
  shots?: number;
  browseLinks?: boolean;
  websearch?: boolean;
  websearchDepth?: number;
  enableMemory?: boolean;
  injectMemoriesFromCollectionNumber?: number;
  conversationResults?: number;
  useSelectedAgent: boolean;
  conversationName: string;
  mode: string;
  promptName: string;
  promptCategory: string;
  agentName: string;
  insightAgent: string;
  baseUri: string;
  showAppBar: boolean;
  showConversationSelector: boolean;
  apiKeyCookie?: string;
  message?: string;
  identified?: false;
  authenticated?: false;
  mutate?: any;
  uploadedFiles?: any[];
  userData?: object;
  sdk?: any;
  conversations?: any[];
  conversation?: any[];
  isLoading?: boolean;
  lastResponse?: any;
  openFileUpload?: boolean;
  promptArgs?: object;
  hasFiles?: boolean;
};
export const AGiXTContext: Context<AGiXTState> = createContext<AGiXTState>({
  selectedChain: '', // Chain name of the selected chain if in chain mode
  chainArgs: {}, // Arguments for the chain
  enableFileUpload: false, // Enable file upload
  contextResults: 5, // Number of context results to show
  shots: 1, // Number of times to run the prompt
  browseLinks: false, // Browse links in user input to memory
  websearch: false, // Websearch user input to memory
  websearchDepth: 0, // Websearch depth
  enableMemory: false, // Enable memory training (not recommended)
  injectMemoriesFromCollectionNumber: 0, // Inject memories from a specific collection number
  conversationResults: 5, // Number of conversation results to show
  useSelectedAgent: true, // Use the selected agent to run the chain instead of what is specified in the chain
  conversationName: 'Test', // Name of the conversation
  mode: 'prompt', // Mode of the chat (prompt or chain)
  promptName: 'Chat', // Name of the prompt to run
  promptCategory: 'Default', // Category of the prompt to run
  agentName: 'gpt4free', // Name of the agent to use
  insightAgent: '', // Name of the agent to use for insight
  baseUri: 'http://localhost:7437', // Base URI of the AGiXT server
  showAppBar: true, // Show the app bar
  showConversationSelector: false, // Show the conversation selector
  apiKeyCookie: 'apiKey' // Name of the cookie to store the API key in
});
