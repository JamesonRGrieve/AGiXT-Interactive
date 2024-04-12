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
  prompt?: string;
  promptCategory?: string;
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
  mode?: 'prompt' | 'chain' | 'command';
  command?: string;
  commandArgs?: object;
  commandMessageArg?: string;
  chain?: string;
  chainRunConfig?: ChainConfig;
};

export type InteractiveConfig = {
  chatSettings?: Overrides;
  agent: string;
  mutate?: (InteractiveConfig) => void | ((previous: InteractiveConfig) => InteractiveConfig);
  agixt?: AGiXTSDK;
  openai?: OpenAI;
};
export const ChatContext: Context<InteractiveConfig> = createContext<InteractiveConfig>(
  ChatDefault as unknown as InteractiveConfig,
);
export const ChatDefaultConfig = ChatDefault;
