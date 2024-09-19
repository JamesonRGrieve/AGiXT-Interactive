'use client';
import AGiXTSDK from 'agixt';
import OpenAI from 'openai';
import { Context, createContext, useContext } from 'react';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ConfigDefault = require('./AGiXTConfigDefault');

export type ChainConfig = {
  chainArgs: object;
  singleStep: boolean;
  fromStep: number;
  allResponses: boolean;
};
export type Overrides = {
  mode?: 'prompt' | 'chain' | 'command';
  prompt?: string;
  promptCategory?: string;
  command?: string;
  commandArgs?: object;
  commandMessageArg?: string;
  chain?: string;
  chainRunConfig?: ChainConfig;
  contextResults?: number;
  shots?: number;
  websearchDepth?: number;
  injectMemoriesFromCollectionNumber?: number;
  conversationResults?: number;
  conversation?: string;
  browseLinks?: boolean;
  webSearch?: boolean;
  insightAgentName?: string;
  enableMemory?: boolean;
};
export type AGiXTConfig = {
  agent: string;
  agixt: AGiXTSDK;
  openai?: OpenAI;
  overrides?: Overrides;
  mutate?: (AGiXTConfig) => void | ((previous: AGiXTConfig) => AGiXTConfig);
};
export const AGiXTConfigContext: Context<AGiXTConfig> = createContext<AGiXTConfig>(ConfigDefault as unknown as AGiXTConfig);
export const AGiXTConfigDefault = ConfigDefault;

export const useAGiXTConfig = (): AGiXTConfig => {
  const context = useContext(AGiXTConfigContext);

  if (context === undefined) {
    throw new Error('No AGiXTConfigContext found');
  }

  return context;
};
