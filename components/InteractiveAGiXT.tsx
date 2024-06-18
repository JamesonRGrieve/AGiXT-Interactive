'use client';
import { getCookie, setCookie } from 'cookies-next';
import React, { ReactNode, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import AppWrapper from 'jrgcomponents/AppWrapper/Wrapper';
import { Menu } from '@mui/icons-material';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { InteractiveConfigDefault, InteractiveConfig, Overrides } from '../types/InteractiveConfigContext';
import ContextWrapper from './ContextWrapper';
import Chat from './Chat/Chat';
import Form from './Form/Form';
import ConversationSelector from './Selectors/ConversationSelector';

import AgentSelector from './Selectors/AgentSelector';
import PromptSelector from './Selectors/PromptSelector';

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
  enableFileUpload?: boolean;
  enableVoiceInput?: boolean;
  alternateBackground?: 'primary' | 'secondary';
  footerMessage?: string;
};
export type ServerProps = {
  apiKey: string;
  agixtServer: string;
};
export type AGiXTInteractiveProps = {
  agent?: string;
  overrides?: Overrides;
  uiConfig?: UIProps;
  serverConfig?: ServerProps;
  formConfig?: FormProps;
};
const selectionBars = {
  agent: <AgentSelector key='agent' />,
  conversation: <ConversationSelector key='conversation' />,
  prompt: <PromptSelector key='prompt' />,
  '': <span>&nbsp;</span>,
};
function removeUndefined(obj: object): object {
  return Object.keys(obj).reduce((acc: object, key: string) => {
    if (obj[key.toString()] && typeof obj[key.toString()] === 'object') {
      const childObject = removeUndefined(obj[key.toString()]);
      if (Object.keys(childObject).length > 0) {
        acc[key.toString()] = childObject;
      }
    } else if (![undefined, null, ''].includes(obj[key.toString()])) {
      acc[key.toString()] = obj[key.toString()];
    }
    return acc;
  }, {});
}
// eslint-disable-next-line sonarjs/cognitive-complexity -- Can't be simplified past this without being less maintainable.
const generateSearchParamConfig = (searchParams: URLSearchParams): InteractiveConfig =>
  removeUndefined({
    agent: searchParams.get('agent') || undefined,
    agixt: undefined,
    openai: undefined,
    overrides: {
      mode: (searchParams.get('mode') as 'prompt' | 'chain' | 'command') || undefined,
      prompt: searchParams.get('prompt') || undefined,
      promptCategory: searchParams.get('promptCategory') || undefined,
      command: searchParams.get('command') || undefined,
      commandArgs: JSON.parse(searchParams.get('commandArgs')) || undefined,
      commandMessageArg: searchParams.get('commandMessageArg') || undefined,
      chain: searchParams.get('chain') || undefined,
      chainRunConfig: {
        chainArgs: JSON.parse(searchParams.get('chainArgs')) || undefined,
        singleStep: Boolean(searchParams.get('singleStep')) || undefined,
        fromStep: Number(searchParams.get('fromStep')) || undefined,
        allResponses: Boolean(searchParams.get('allResponses')) || undefined,
      },
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
    },
    mutate: undefined,
  }) as InteractiveConfig;
const Stateful = (props: AGiXTInteractiveProps): React.JSX.Element => {
  const searchParams = useSearchParams();
  const searchParamConfig = generateSearchParamConfig(searchParams);

  const uuid = getCookie('uuid');
  if (process.env.NEXT_PUBLIC_AGIXT_CONVERSATION_MODE === 'uuid' && !uuid) {
    setCookie('uuid', crypto.randomUUID(), { domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN, maxAge: 2147483647 });
  }
  console.log(props.overrides);
  console.log(process.env.NEXT_PUBLIC_AGIXT_PROMPT_NAME);
  return (
    <ContextWrapper
      apiKey={props.serverConfig?.apiKey || process.env.NEXT_PUBLIC_AGIXT_API_KEY || getCookie('jwt') || ''}
      agixtServer={props.serverConfig?.agixtServer || process.env.NEXT_PUBLIC_AGIXT_SERVER || 'http://localhost:7437'}
      initialState={{
        ...InteractiveConfigDefault,
        agent: props.agent ?? process.env.NEXT_PUBLIC_AGIXT_AGENT ?? InteractiveConfigDefault.agent,
        overrides: {
          ...InteractiveConfigDefault.overrides,
          mode: process.env.NEXT_PUBLIC_AGIXT_MODE,
          prompt: process.env.NEXT_PUBLIC_AGIXT_PROMPT_NAME,
          promptCategory: process.env.NEXT_PUBLIC_AGIXT_PROMPT_CATEGORY,
          chain: process.env.NEXT_PUBLIC_AGIXT_CHAIN,
          command: process.env.NEXT_PUBLIC_AGIXT_COMMAND,
          commandMessageArg: process.env.NEXT_PUBLIC_AGIXT_COMMAND_MESSAGE_ARG,
          conversationName:
            process.env.NEXT_PUBLIC_AGIXT_CONVERSATION_MODE === 'uuid'
              ? uuid
              : process.env.NEXT_PUBLIC_AGIXT_CONVERSATION_NAME,
          ...props.overrides,
        },
        ...(process.env.NEXT_PUBLIC_AGIXT_ENABLE_SEARCHPARAM_CONFIG === 'true' ? searchParamConfig : {}),
      }}
    >
      <Interactive
        {...props.overrides}
        {...props.uiConfig}
        enableVoiceInput={
          process.env.NEXT_PUBLIC_AGIXT_VOICE_INPUT_ENABLED === 'true' ??
          (Boolean(searchParams.get('voiceInput')) || undefined)
        }
        enableFileUpload={
          process.env.NEXT_PUBLIC_AGIXT_FILE_UPLOAD_ENABLED === 'true' ??
          (Boolean(searchParams.get('fileUpload')) || undefined)
        }
      />
    </ContextWrapper>
  );
};
const Interactive = (props: Overrides & UIProps): React.JSX.Element => {
  const mobile = useMediaQuery('(max-width: 1100px)');
  const menuItem = (): ReactNode => (
    <Box p='0.5rem' display='flex' flexDirection='column' gap='0.5rem'>
      {process.env.NEXT_PUBLIC_AGIXT_SHOW_SELECTION?.split(',').map((selector) => selectionBars[String(selector)])}
    </Box>
  );
  //console.log(mobile);
  return (
    <AppWrapper
      header={
        process.env.NEXT_PUBLIC_AGIXT_SHOW_APP_BAR === 'true' && {
          components: {
            left: mobile ? (
              {
                icon: <Menu />,
                swr: (): object => {
                  return {};
                },
                menu: menuItem,
                width: mobile ? '12rem' : '30rem',
              }
            ) : (
              <Box display='flex' gap='1rem' width='100%' maxWidth='32rem'>
                {process.env.NEXT_PUBLIC_AGIXT_SHOW_SELECTION.split(',').map((selector) =>
                  selector === 'conversation' && process.env.NEXT_PUBLIC_AGIXT_SHOW_SELECTION.split(',').length > 1
                    ? null
                    : selectionBars[selector],
                )}
              </Box>
            ),
            right:
              !mobile &&
              process.env.NEXT_PUBLIC_AGIXT_SHOW_SELECTION.includes('conversation') &&
              process.env.NEXT_PUBLIC_AGIXT_SHOW_SELECTION.includes(',') ? (
                <Box minWidth='12rem' width='100%' display='flex'>
                  {selectionBars['conversation']}
                </Box>
              ) : undefined,
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
        <Form
          mode={props.mode}
          showChatThemeToggles={props.showChatThemeToggles}
          enableFileUpload={props.enableFileUpload}
          enableVoiceInput={props.enableVoiceInput}
        />
      ) : (
        <Chat
          mode={props.mode}
          showChatThemeToggles={props.showChatThemeToggles}
          alternateBackground={props.alternateBackground}
          enableFileUpload={props.enableFileUpload}
          enableVoiceInput={props.enableVoiceInput}
        />
      )}
    </AppWrapper>
  );
};
const InteractiveAGiXT = ({
  stateful = true,
  agent,
  overrides = {
    mode: (process.env.NEXT_PUBLIC_AGIXT_MODE && ['chain', 'prompt'].includes(process.env.NEXT_PUBLIC_AGIXT_MODE)
      ? process.env.NEXT_PUBLIC_AGIXT_MODE
      : 'prompt') as 'chain' | 'prompt',
  },
  serverConfig = null,
  uiConfig = {},
}: AGiXTInteractiveProps & { stateful?: boolean; agent?: string }): React.JSX.Element => {
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
        ? 'InteractiveAGiXT will provide its own InteractiveConfigContext Provider and state.'
        : 'Assuming a InteractiveConfigContext Provider encloses this instance.'
    }`,
  );
  // console.log('Configuration Provided From Server: ', chatConfig, serverConfig, uiConfig);
  return stateful ? (
    <Stateful overrides={overrides} serverConfig={serverConfig} uiConfig={uiConfigWithEnv} agent={agent} />
  ) : (
    <Interactive {...uiConfigWithEnv} {...overrides} />
  );
};
export default InteractiveAGiXT;
