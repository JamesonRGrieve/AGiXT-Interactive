'use client';
import AGiXTSDK from 'agixt';
import OpenAI from 'openai';
import { Context, createContext } from 'react';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ChatDefault = require('./ChatDefault');

export type ChainConfig = {
  chainArgs: object;
  singleStep: boolean;
  fromStep: number;
  allResponses: boolean;
};
export type Overrides = {
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
  chainRunConfig?: ChainConfig;
};

export type InteractiveConfig = {
  chatSettings?: Overrides;
  prompt?: string;
  promptCategory?: string;
  command?: string;
  commandArgs?: object;
  commandMessageArg?: string;
  chain?: string;
  mode?: 'prompt' | 'chain' | 'command';
  mutate?: (InteractiveConfig) => void | ((previous: InteractiveConfig) => InteractiveConfig);
  sdk?: AGiXTSDK;
  openai?: OpenAI;
};
export const ChatContext: Context<InteractiveConfig> = createContext<InteractiveConfig>(
  ChatDefault as unknown as InteractiveConfig,
);
export const ChatDefaultConfig = ChatDefault;
