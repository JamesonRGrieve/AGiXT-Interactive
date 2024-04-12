'use client';
import { getCookie, setCookie } from 'cookies-next';
import React, { ReactNode, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import AppWrapper from 'jrgcomponents/AppWrapper/Wrapper';
import { Menu } from '@mui/icons-material';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { ChatDefaultConfig, InteractiveConfig } from '../types/ChatContext';
import ContextWrapper from './ContextWrapper';
import Chat from './Chat/Chat';
import Form from './Form/Form';
import ConversationSelector from './Selectors/ConversationSelector';

import AgentSelector from './Selectors/AgentSelector';
import PromptSelector from './Selectors/PromptSelector';

export type ChatProps = {
  mode: 'prompt' | 'chain' | 'command';
  opts?: InteractiveConfig;
};
export type FormProps = {
  fieldOverrides?: { [key: string]: ReactNode };
  formContext?: object;
  additionalFields?: { [key: string]: ReactNode };
  additionalOutputButtons: { [key: string]: ReactNode };
  onSubmit?: (data: object) => void;
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
export type AGiXTInteractiveProps = {
  uiConfig?: UIProps;
  serverConfig?: ServerProps;
  chatConfig?: ChatProps;
  formConfig?: FormProps;
};
const selectionBars = {
  agent: <AgentSelector />,
  conversation: <ConversationSelector />,
  prompt: <PromptSelector />,
  '': <span>&nbsp;</span>,
};
const Stateful = (props: AGiXTInteractiveProps): React.JSX.Element => {
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
        enableVoiceInput: Boolean(searchParams.get('voiceInput')) || undefined,
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
      mode: searchParams.get('mode') || undefined,
      mutate: undefined,
      sdk: undefined,
      openai: undefined,
    },
  } as InteractiveConfig;
  const apiKey = props.serverConfig?.apiKey || process.env.NEXT_PUBLIC_AGIXT_API_KEY || getCookie('jwt') || '';
  const agixtServer = props.serverConfig?.agixtServer || process.env.NEXT_PUBLIC_AGIXT_SERVER || 'http://localhost:7437';

  const uuid = getCookie('uuid');
  if (process.env.NEXT_PUBLIC_AGIXT_CONVERSATION_MODE === 'uuid' && !uuid) {
    setCookie('uuid', crypto.randomUUID(), { domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN, maxAge: 2147483647 });
  }
  if (process.env.NEXT_PUBLIC_ENV === 'development') {
    console.log('Stateful API Key: ', apiKey);
    console.log('Stateful AGiXTChat initialized with server config (server:key): ', agixtServer, apiKey);
    console.log('InteractiveAGiXT Props: ', props);
  }

  return (
    <ContextWrapper
      apiKey={props.serverConfig?.apiKey || apiKey}
      agixtServer={props.serverConfig?.agixtServer || agixtServer}
      initialState={{
        ...ChatDefaultConfig,
        prompt: process.env.NEXT_PUBLIC_AGIXT_PROMPT_NAME,
        promptCategory: process.env.NEXT_PUBLIC_AGIXT_PROMPT_CATEGORY,
        chain: process.env.NEXT_PUBLIC_AGIXT_CHAIN,
        command: process.env.NEXT_PUBLIC_AGIXT_COMMAND,
        commandMessageArg: process.env.NEXT_PUBLIC_AGIXT_COMMAND_MESSAGE_ARG,
        mode: process.env.NEXT_PUBLIC_AGIXT_MODE,
        ...props.chatConfig.opts,
        chatSettings: {
          ...ChatDefaultConfig.chatSettings,
          enableFileUpload: process.env.NEXT_PUBLIC_AGIXT_FILE_UPLOAD_ENABLED === 'true' ?? true,
          enableVoiceInput: process.env.NEXT_PUBLIC_AGIXT_VOICE_INPUT_ENABLED === 'true' ?? true,
          ...(process.env.NEXT_PUBLIC_AGIXT_AGENT && { selectedAgent: process.env.NEXT_PUBLIC_AGIXT_AGENT }),
          conversationName:
            process.env.NEXT_PUBLIC_AGIXT_CONVERSATION_MODE === 'uuid'
              ? uuid
              : process.env.NEXT_PUBLIC_AGIXT_CONVERSATION_NAME,
          ...props.chatConfig.opts?.chatSettings,
          ...(process.env.NEXT_PUBLIC_AGIXT_ENABLE_SEARCHPARAM_CONFIG === 'true' ? searchParamConfig : {}),
        },
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
  const mobile = useMediaQuery('(max-width: 600px)');
  const menuItem = (): ReactNode => (
    <Box p='0.5rem' display='flex' flexDirection='column' gap='0.5rem'>
      {process.env.NEXT_PUBLIC_AGIXT_SHOW_SELECTION.split(',').map((selector) => selectionBars[String(selector)])}
    </Box>
  );
  console.log(mobile);
  return (
    <AppWrapper
      header={
        process.env.NEXT_PUBLIC_AGIXT_SHOW_APP_BAR === 'true' && {
          components: {
            left: mobile
              ? {
                  icon: <Menu />,
                  swr: () => {},
                  menu: menuItem,
                  width: '12rem',
                }
              : selectionBars[process.env.NEXT_PUBLIC_AGIXT_SHOW_SELECTION],
          },
        }
      }
      footer={
        process.env.NEXT_PUBLIC_AGIXT_FOOTER_MESSAGE && {
          components: {
            center: (
              <Box textAlign='center'>
                <Typography sx={{ margin: 0 }} variant='caption'>
                  {process.env.NEXT_PUBLIC_AGIXT_FOOTER_MESSAGE}
                </Typography>
              </Box>
            ),
          },
        }
      }
    >
      {process.env.NEXT_PUBLIC_INTERACTIVE_UI === 'form' ? (
        <Form mode={props.mode} showChatThemeToggles={props.showChatThemeToggles} />
      ) : (
        <Chat
          mode={props.mode}
          showChatThemeToggles={props.showChatThemeToggles}
          alternateBackground={props.alternateBackground}
        />
      )}
    </AppWrapper>
  );
};
const AGiXTChat = ({
  stateful = true,
  chatConfig = {
    mode: (process.env.NEXT_PUBLIC_AGIXT_MODE && ['chain', 'prompt'].includes(process.env.NEXT_PUBLIC_AGIXT_MODE)
      ? process.env.NEXT_PUBLIC_AGIXT_MODE
      : 'prompt') as 'chain' | 'prompt',
  },
  serverConfig = null,
  uiConfig = {},
}: AGiXTInteractiveProps & { stateful?: boolean }): React.JSX.Element => {
  const uiConfigWithEnv = useMemo(
    () => ({
      showAppBar: process.env.NEXT_PUBLIC_AGIXT_SHOW_APP_BAR === 'true', // Show the conversation selection bar to create, delete, and export conversations
      showConversationSelector: process.env.NEXT_PUBLIC_AGIXT_SHOW_CONVERSATION_BAR === 'true', // Show the conversation selection bar to create, delete, and export conversations
      showRLHF: process.env.NEXT_PUBLIC_AGIXT_RLHF === 'true',
      showChatThemeToggles: process.env.NEXT_PUBLIC_AGIXT_SHOW_CHAT_THEME_TOGGLES === 'true',
      footerMessage: process.env.NEXT_PUBLIC_AGIXT_FOOTER_MESSAGE || '',
      alternateBackground: 'primary' as 'primary' | 'secondary',
      ...uiConfig,
    }),
    [uiConfig],
  );
  console.log(
    `InteractiveAGiXT initialized as ${stateful ? '' : 'not '}stateful. ${
      stateful
        ? 'InteractiveAGiXT will provide its own ChatContext Provider and state.'
        : 'Assuming a ChatContext Provider encloses this instance.'
    }`,
  );
  // console.log('Configuration Provided From Server: ', chatConfig, serverConfig, uiConfig);
  return stateful ? (
    <Stateful chatConfig={chatConfig} serverConfig={serverConfig} uiConfig={uiConfigWithEnv} />
  ) : (
    <Stateless {...uiConfigWithEnv} {...chatConfig} />
  );
};
export default AGiXTChat;
