'use client';
import { getCookie, setCookie } from 'cookies-next';
import React from 'react';
import { Box, useTheme } from '@mui/material';
import { ChatDefaultConfig, ChatConfig } from '../types/ChatContext';
import ContextWrapper from './ContextWrapper';
import Chat from './Chat/Chat';
import Header from './Header';
import Footer from './Footer';

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
  footerMeessage?: string;
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
  const apiKey = props.serverConfig?.apiKey || process.env.NEXT_PUBLIC_API_KEY || '';
  const agixtServer = props.serverConfig?.agixtServer || process.env.NEXT_PUBLIC_AGIXT_SERVER || 'http://localhost:7437';
  const agentName = process.env.NEXT_PUBLIC_AGIXT_AGENT_NAME || 'gpt4free';
  const uuid = getCookie('uuid');
  if (process.env.NEXT_PUBLIC_AGIXT_CONVERSATION_MODE === 'uuid' && !uuid) {
    setCookie('uuid', crypto.randomUUID(), { domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN, maxAge: 2147483647 });
  }
  console.log('Stateful Footer Message: ', props.uiConfig?.footerMeessage);
  console.log('Stateful Themes: ', props.uiConfig?.showChatThemeToggles);
  console.log('Environment AGiXT Server: ', process.env.NEXT_PUBLIC_AGIXT_SERVER);
  console.log('Stateful AGiXTChat initialized with server config (server:key): ', agixtServer, apiKey);
  console.log('AGiXT Chat Props: ', props);
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
        },
        prompt: props.chatConfig.opts?.prompt || process.env.NEXT_PUBLIC_AGIXT_PROMPT_NAME,
        promptCategory: props.chatConfig.opts?.promptCategory || process.env.NEXT_PUBLIC_AGIXT_PROMPT_CATEGORY,
        chain: props.chatConfig.opts?.chain || process.env.NEXT_PUBLIC_AGIXT_CHAIN,
        command: props.chatConfig.opts?.command || process.env.NEXT_PUBLIC_AGIXT_COMMAND,
        commandArgs: props.chatConfig.opts?.commandArgs || {},
        commandMessageArg: props.chatConfig.opts?.commandMessageArg || process.env.NEXT_PUBLIC_AGIXT_COMMAND_MESSAGE_ARG,
      }}
    >
      <ChatWrapper {...props.chatConfig} {...props.uiConfig} />
    </ContextWrapper>
  );
};
const Stateless = (props: ChatProps & UIProps): React.JSX.Element => {
  return <ChatWrapper {...props} />;
};
const ChatWrapper = (props: ChatProps & UIProps): React.JSX.Element => {
  const theme = useTheme();
  console.log('ChatWrapper Footer Message: ', props.footerMeessage);
  console.log('ChatWrapper Themes: ', props.showChatThemeToggles);
  return (
    <>
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
          overflowY: 'clip',
        }}
        component='main'
      >
        <Chat
          mode={props.mode}
          showChatThemeToggles={props.showChatThemeToggles}
          alternateBackground={props.alternateBackground}
        />
      </Box>
      {(props.footerMeessage ?? process.env.NEXT_PUBLIC_AGIXT_FOOTER_MESSAGE) && <Footer message={props.footerMeessage} />}
    </>
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
    footerMeessage: '',
    alternateBackground: 'primary',
  },
}: AGiXTChatProps & { stateful?: boolean }): React.JSX.Element => {
  console.log(
    `AGiXTChat initialized as ${stateful ? '' : 'not '}stateful. ${
      stateful
        ? 'AGiXTChat will provide its own ChatContext Provider and state.'
        : 'Assuming a ChatContext Provider encloses this instance.'
    }`,
  );
  console.log('Opts Provided: ', chatConfig?.opts);
  return stateful ? (
    <Stateful chatConfig={chatConfig} serverConfig={serverConfig} uiConfig={uiConfig} />
  ) : (
    <Stateless {...uiConfig} {...chatConfig} />
  );
};
export default AGiXTChat;
