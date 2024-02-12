'use client';
import { getCookie, setCookie } from 'cookies-next';
import React from 'react';
import { ChatDefaultConfig, ChatConfig } from '../types/ChatContext';
import ContextWrapper from './ContextWrapper';
import Chat from './ChatWindow';

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

const Stateful = (props: ChatProps) => {
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
            props.opts?.chatSettings?.conversationName || process.env.NEXT_PUBLIC_AGIXT_CONVERSATION_MODE === 'uuid'
              ? uuid
              : process.env.NEXT_PUBLIC_AGIXT_CONVERSATION_NAME,
        },
        prompt: props.opts?.prompt || process.env.NEXT_PUBLIC_AGIXT_PROMPT_NAME,
        promptCategory: props.opts?.promptCategory || process.env.NEXT_PUBLIC_AGIXT_PROMPT_CATEGORY,
      }}
    >
      <Chat {...props} />
    </ContextWrapper>
  );
};
const Stateless = (props: ChatProps) => {
  return <Chat {...props} />;
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
  return stateful ? (
    <Stateful mode={mode} showAppBar={showAppBar} showConversationSelector={showConversationSelector} opts={opts} />
  ) : (
    <Stateless mode={mode} showAppBar={showAppBar} showConversationSelector={showConversationSelector} />
  );
};
export default AGiXTChat;
