'use client';
import { getCookie, setCookie } from 'cookies-next';
import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { ChatDefaultConfig, ChatConfig } from '../types/ChatContext';
import ContextWrapper from './ContextWrapper';
import Chat from './Chat/Chat';
import Form from './Form/Form';
import { useSearchParams } from 'next/navigation';
export type ChatProps = {
  mode: 'prompt' | 'chain' | 'command';
  opts?: ChatConfig;
};
export type UIProps = {
  showAppBar?: boolean;
  showConversationSelector?: boolean;
  showChatThemeToggles?: boolean;
  showRLHF?: boolean;
  alternateBackground?: 'primary' | 'secondary';
  footerMessage?: string;
};
export type ServerProps = {
  apiKey: string;
  agixtServer: string;
};
export type AGiXTChatProps = {
  uiConfig?: UIProps;
  serverConfig?: ServerProps;
  chatConfig?: ChatProps;
};

const Stateful = (props: AGiXTChatProps): React.JSX.Element => {
  const searchParams = useSearchParams();
  const searchParamConfig = {
    mode: ['prompt', 'chain'].includes(searchParams.get('mode'))
      ? (searchParams.get('mode') as 'prompt' | 'chain')
      : props.chatConfig.mode || 'prompt',
    opts: {
      chatSettings: {
        selectedAgent: searchParams.get('agent') || undefined,
        contextResults: Number(searchParams.get('contextResults')) || undefined,
        shots: Number(searchParams.get('shots')) || undefined,
        websearchDepth: Number(searchParams.get('websearchDepth')) || undefined,
        injectMemoriesFromCollectionNumber: Number(searchParams.get('injectMemoriesFromCollectionNumber')) || undefined,
        conversationResults: Number(searchParams.get('results')) || undefined,
        conversationName: searchParams.get('conversation') || undefined,
        browseLinks: Boolean(searchParams.get('browseLinks')) || undefined,
        webSearch: Boolean(searchParams.get('webSearch')) || undefined,
        insightAgentName: searchParams.get('insightAgent') || undefined,
        enableMemory: Boolean(searchParams.get('memory')) || undefined,
        enableFileUpload: Boolean(searchParams.get('fileUpload')) || undefined,
        useSelectedAgent: Boolean(searchParams.get('useSelectedAgent')) || undefined,
        chainRunConfig: {
          chainArgs: JSON.parse(searchParams.get('chainArgs')) || undefined,
          singleStep: Boolean(searchParams.get('singleStep')) || undefined,
          fromStep: Number(searchParams.get('fromStep')) || undefined,
          allResponses: Boolean(searchParams.get('allResponses')) || undefined,
        },
      },
      prompt: searchParams.get('prompt') || undefined,
      promptCategory: searchParams.get('promptCategory') || undefined,
      command: searchParams.get('command') || undefined,
      commandArgs: JSON.parse(searchParams.get('commandArgs')) || undefined,
      commandMessageArg: searchParams.get('commandMessageArg') || undefined,
      chain: searchParams.get('chain') || undefined,
      conversations: undefined,
      mutate: undefined,
      sdk: undefined,
      openai: undefined,
    },
  } as ChatConfig;
  const apiKey =
    props.serverConfig?.apiKey ?? getCookie('apiKey') ?? getCookie('jwt') ?? process.env.NEXT_PUBLIC_AGIXT_API_KEY ?? '';
  const agixtServer = props.serverConfig?.agixtServer || process.env.NEXT_PUBLIC_AGIXT_SERVER || 'http://localhost:7437';
  const agentName = process.env.NEXT_PUBLIC_AGIXT_AGENT_NAME || 'gpt4free';
  const uuid = getCookie('uuid');
  if (process.env.NEXT_PUBLIC_AGIXT_CONVERSATION_MODE === 'uuid' && !uuid) {
    setCookie('uuid', crypto.randomUUID(), { domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN, maxAge: 2147483647 });
  }
  // console.log('Stateful Footer Message: ', props.uiConfig?.footerMessage);
  // console.log('Stateful Themes: ', props.uiConfig?.showChatThemeToggles);
  // console.log('Environment AGiXT Server: ', process.env.NEXT_PUBLIC_AGIXT_SERVER);
  // console.log('Stateful AGiXTChat initialized with server config (server:key): ', agixtServer, apiKey);
  // console.log('InteractiveAGiXT Props: ', props);
  return (
    <ContextWrapper
      requireKey={process.env.NEXT_PUBLIC_AGIXT_REQUIRE_API_KEY === 'true'}
      apiKey={props.serverConfig?.apiKey || apiKey}
      agixtServer={props.serverConfig?.agixtServer || agixtServer}
      initialState={{
        ...ChatDefaultConfig,
        chatSettings: {
          ...ChatDefaultConfig.chatSettings,
          ...props.chatConfig.opts?.chatSettings,
          selectedAgent:
            props.chatConfig.opts?.chatSettings?.selectedAgent || process.env.NEXT_PUBLIC_AGIXT_AGENT || agentName,
          conversationName:
            process.env.NEXT_PUBLIC_AGIXT_CONVERSATION_MODE === 'uuid'
              ? uuid
              : props.chatConfig.opts?.chatSettings?.conversationName || process.env.NEXT_PUBLIC_AGIXT_CONVERSATION_NAME,
          ...(process.env.NEXT_PUBLIC_AGIXT_ENABLE_SEARCHPARAM_CONFIG === 'true' ? searchParamConfig : {}),
        },
        prompt: props.chatConfig.opts?.prompt || process.env.NEXT_PUBLIC_AGIXT_PROMPT_NAME,
        promptCategory: props.chatConfig.opts?.promptCategory || process.env.NEXT_PUBLIC_AGIXT_PROMPT_CATEGORY,
        chain: props.chatConfig.opts?.chain || process.env.NEXT_PUBLIC_AGIXT_CHAIN,
        command: props.chatConfig.opts?.command || process.env.NEXT_PUBLIC_AGIXT_COMMAND,
        commandArgs: props.chatConfig.opts?.commandArgs || {},
        commandMessageArg: props.chatConfig.opts?.commandMessageArg || process.env.NEXT_PUBLIC_AGIXT_COMMAND_MESSAGE_ARG,
      }}
    >
      <Interactive {...props.chatConfig} {...props.uiConfig} />
    </ContextWrapper>
  );
};
const Stateless = (props: ChatProps & UIProps): React.JSX.Element => {
  return <Interactive {...props} />;
};
const Interactive = (props: ChatProps & UIProps): React.JSX.Element => {
  return process.env.NEXT_PUBLIC_INTERACTIVE_MODE === 'form' ? (
    <Form mode={props.mode} showChatThemeToggles={props.showChatThemeToggles} />
  ) : (
    <Chat
      mode={props.mode}
      showChatThemeToggles={props.showChatThemeToggles}
      alternateBackground={props.alternateBackground}
    />
  );
};
const AGiXTChat = ({
  stateful = true,
  chatConfig = null,
  serverConfig = null,
  uiConfig = {
    showAppBar: false,
    showConversationSelector: false,
    showChatThemeToggles: false,
    showRLHF: false,
    footerMessage: process.env.NEXT_PUBLIC_AGIXT_FOOTER_MESSAGE ?? '',
    alternateBackground: 'primary',
  },
}: AGiXTChatProps & { stateful?: boolean }): React.JSX.Element => {
  console.log(
    `InteractiveAGiXT initialized as ${stateful ? '' : 'not '}stateful. ${
      stateful
        ? 'InteractiveAGiXT will provide its own ChatContext Provider and state.'
        : 'Assuming a ChatContext Provider encloses this instance.'
    }`,
  );
  // console.log('Configuration Provided: ', chatConfig, serverConfig, uiConfig);
  return stateful ? (
    <Stateful chatConfig={chatConfig} serverConfig={serverConfig} uiConfig={uiConfig} />
  ) : (
    <Stateless {...uiConfig} {...chatConfig} />
  );
};
export default AGiXTChat;
