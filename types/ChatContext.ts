'use client';
import AGiXTSDK from 'agixt';
import { Context, createContext } from 'react';
const ChatDefault = require('./ChatDefault');
console.log(ChatDefault);
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
export type ChatConfig = {
  chatSettings: ChatSettings;
  prompt: string;
  promptCategory: string;
  chain: string;
  //message: string;
  mutate: any;
  sdk: AGiXTSDK;
};
export const ChatContext: Context<ChatConfig> = createContext<ChatConfig>(ChatDefault as unknown as ChatConfig);
export const ChatDefaultConfig = ChatDefault;
