'use client';
import AGiXTSDK from 'agixt';
import OpenAI from 'openai';
import { Context, createContext } from 'react';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ChatDefault = require('./ChatDefault');

export type ChainRunConfig = {
  chainArgs: object;
  singleStep: boolean;
  fromStep: number;
  allResponses: boolean;
};
export type ChatSettings = {
  selectedAgent?: string;
  contextResults?: number;
  shots?: number;
  websearchDepth?: number;
  injectMemoriesFromCollectionNumber?: number;
  conversationResults?: number;
  conversationName?: string;
  browseLinks?: boolean;
  webSearch?: boolean;
  insightAgentName?: string;
  enableMemory?: boolean;
  enableFileUpload?: boolean;
  enableVoiceInput?: boolean;
  useSelectedAgent?: boolean;
  chainRunConfig?: ChainRunConfig;
};
export type ChatConfig = {
  chatSettings?: ChatSettings;
  prompt?: string;
  promptCategory?: string;
  command?: string;
  commandArgs?: object;
  commandMessageArg?: string;
  chain?: string;
  mode?: 'prompt' | 'chain' | 'command';
  mutate?: (ChatConfig) => void | ((previous: ChatConfig) => ChatConfig);
  sdk?: AGiXTSDK;
  openai?: OpenAI;
};
export const ChatContext: Context<ChatConfig> = createContext<ChatConfig>(ChatDefault as unknown as ChatConfig);
export const ChatDefaultConfig = ChatDefault;
