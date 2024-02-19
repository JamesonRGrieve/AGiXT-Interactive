'use client';
import { getCookie, setCookie } from 'cookies-next';
import React, { ReactElement } from 'react';
import { Box, useTheme } from '@mui/material';
import { ChatDefaultConfig, ChatConfig } from '../types/ChatContext';
import ContextWrapper from './ContextWrapper';
import Chat from './Chat/Chat';
import Header from './Header';

export type ChatProps = {
  mode: 'prompt' | 'chain';
  showAppBar?: boolean;
  showConversationSelector?: boolean;
  serverConfig?: {
    apiKey: string;
    agixtServer: string;
  };
  opts?: ChatConfig;
};

const Stateful = (props: ChatProps): ReactElement => {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY || '';
  const agixtServer = process.env.NEXT_PUBLIC_AGIXT_SERVER || 'http://localhost:7437';
  const agentName = process.env.NEXT_PUBLIC_AGIXT_AGENT_NAME || 'gpt4free';
  const uuid = getCookie('uuid');
  if (process.env.NEXT_PUBLIC_AGIXT_CONVERSATION_MODE === 'uuid' && !uuid) {
    setCookie('uuid', crypto.randomUUID(), { domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN, maxAge: 2147483647 });
  }

  return (
    <ContextWrapper
      requireKey={process.env.NEXT_PUBLIC_AGIXT_REQUIRE_API_KEY === 'true'}
      apiKey={props.serverConfig?.apiKey || apiKey}
      agixtServer={props.serverConfig?.agixtServer || agixtServer}
      initialState={{
        ...ChatDefaultConfig,
        chatSettings: {
          ...ChatDefaultConfig.chatSettings,
          ...props.opts?.chatSettings,
          selectedAgent: props.opts?.chatSettings?.selectedAgent || agentName || process.env.NEXT_PUBLIC_AGIXT_AGENT,
          conversationName:
            process.env.NEXT_PUBLIC_AGIXT_CONVERSATION_MODE === 'uuid'
              ? uuid
              : props.opts?.chatSettings?.conversationName || process.env.NEXT_PUBLIC_AGIXT_CONVERSATION_NAME,
        },
        prompt: props.opts?.prompt || process.env.NEXT_PUBLIC_AGIXT_PROMPT_NAME,
        promptCategory: props.opts?.promptCategory || process.env.NEXT_PUBLIC_AGIXT_PROMPT_CATEGORY,
        chain: props.opts?.chain || process.env.NEXT_PUBLIC_AGIXT_CHAIN,
        command: props.opts?.command || process.env.NEXT_PUBLIC_AGIXT_COMMAND,
        commandArgs: props.opts?.commandArgs || {},
        commandMessageArg: props.opts?.commandMessageArg || process.env.NEXT_PUBLIC_AGIXT_COMMAND_MESSAGE_ARG,
      }}
    >
      <ChatWrapper {...props} />
    </ContextWrapper>
  );
};
const Stateless = (props: ChatProps) => {
  return <ChatWrapper {...props} />;
};
const ChatWrapper = (props: ChatProps) => {
  const theme = useTheme();
  return (
    <Box height='100%' display='flex' flexDirection='column'>
      {props.showAppBar && <Header showConversationSelector={props.showConversationSelector} />}
      <Box
        style={{
          height: '100%',
          maxWidth: '100%',
          flexGrow: '1',
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          display: 'flex',
          flexDirection: 'column',
        }}
        component='main'
      >
        <Chat mode={props.mode} />
      </Box>
    </Box>
  );
};
const AGiXTChat = ({
  stateful = true,
  mode,
  showAppBar = false,
  showConversationSelector = false,
  opts,
}: ChatProps & { stateful?: boolean }) => {
  console.log(
    `AGiXTChat initialized as ${stateful ? '' : 'not '}stateful. ${
      stateful
        ? 'AGiXTChat will provide its own ChatContext Provider and state.'
        : 'Assuming a ChatContext Provider encloses this instance.'
    }`,
  );
  console.log('Opts Provided: ', opts);
  return stateful ? (
    <Stateful mode={mode} showAppBar={showAppBar} showConversationSelector={showConversationSelector} opts={opts} />
  ) : (
    <Stateless mode={mode} showAppBar={showAppBar} showConversationSelector={showConversationSelector} />
  );
};
export default AGiXTChat;
