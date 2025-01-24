'use client';

import { useContext, useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';
import useSWR, { mutate } from 'swr';
import { UIProps } from '../InteractiveAGiXT';
import { InteractiveConfigContext, Overrides } from '../InteractiveConfigContext';
import ChatLog from './ChatLog';
import ChatBar from './ChatInput';
import log from '@/components/jrg/next-log/log';
import { useCompany } from '../hooks';

export async function getAndFormatConversastion(state): Promise<any[]> {
  const rawConversation = await state.agixt.getConversation('', state.overrides.conversation, 100, 1);
  log(['Raw conversation: ', rawConversation], { client: 3 });
  return rawConversation.reduce((accumulator, currentMessage: { id: string; message: string }) => {
    const messageType = currentMessage.message.split(' ')[0];
    log(['Message type: ', messageType], { client: 2 });
    if (messageType.startsWith('[SUBACTIVITY]')) {
      let target;
      const parent = messageType.split('[')[2].split(']')[0];

      const parentIndex = accumulator.findIndex((message) => {
        return message.id === parent || message.children.some((child) => child.id === parent);
      });
      if (parentIndex !== -1) {
        if (accumulator[parentIndex].id === parent) {
          target = accumulator[parentIndex];
        } else {
          target = accumulator[parentIndex].children.find((child) => child.id === parent);
        }
        target.children.push({ ...currentMessage, children: [] });
      } else {
        throw new Error(
          `Parent message not found for subactivity ${currentMessage.id} - ${currentMessage.message}, parent ID: ${parent}`,
        );
      }
    } else {
      accumulator.push({ ...currentMessage, children: [] });
    }
    return accumulator;
  }, []);
}

const conversationSWRPath = '/conversation/';
export default function Chat({
  showChatThemeToggles,
  alternateBackground,
  enableFileUpload,
  enableVoiceInput,
  showOverrideSwitchesCSV,
}: Overrides & UIProps): React.JSX.Element {
  const [loading, setLoading] = useState(false);
  const state = useContext(InteractiveConfigContext);
  const conversation = useSWR(
    conversationSWRPath + state.overrides.conversation,
    async () => {
      return await getAndFormatConversastion(state);
    },
    {
      fallbackData: [],
      refreshInterval: loading ? 1000 : 0,
    },
  );
  const { data: activeCompany } = useCompany();
  useEffect(() => {
    if (Array.isArray(state.overrides.conversation)) {
      state.mutate((oldState) => ({
        ...oldState,
        overrides: { ...oldState.overrides, conversation: oldState.overrides.conversation[0] },
      }));
    }
  }, [state.overrides.conversation]);
  async function chat(messageTextBody, messageAttachedFiles): Promise<string> {
    const messages = [];

    messages.push({
      role: 'user',
      content: [
        { type: 'text', text: messageTextBody },
        ...Object.entries(messageAttachedFiles).map(([fileName, fileContent]: [string, string]) => ({
          type: `${fileContent.split(':')[1].split('/')[0]}_url`,
          file_name: fileName,
          [`${fileContent.split(':')[1].split('/')[0]}_url`]: {
            url: fileContent,
          },
        })), // Spread operator to include all file contents
      ],
      ...(activeCompany?.id ? { company_id: activeCompany?.id } : {}),
      ...(getCookie('agixt-create-image') ? { create_image: getCookie('agixt-create-image') } : {}),
      ...(getCookie('agixt-tts') ? { tts: getCookie('agixt-tts') } : {}),
      ...(getCookie('agixt-websearch') ? { websearch: getCookie('agixt-websearch') } : {}),
      ...(getCookie('agixt-analyze-user-input') ? { analyze_user_input: getCookie('agixt-analyze-user-input') } : {}),
    });

    const toOpenAI = {
      messages: messages,
      model: getCookie('agixt-agent'),
      user: state.overrides.conversation,
    };
    setLoading(true);
    log(['Sending: ', state.openai, toOpenAI], { client: 1 });
    const req = state.openai.chat.completions.create(toOpenAI);
    await new Promise((resolve) => setTimeout(resolve, 100));
    mutate(conversationSWRPath + state.overrides.conversation);
    const chatCompletion = await req;
    log(['RESPONSE: ', chatCompletion], { client: 1 });
    state.mutate((oldState) => ({
      ...oldState,
      overrides: {
        ...oldState.overrides,
        conversation: chatCompletion.id,
      },
    }));
    let response;
    if (state.overrides.conversation === '-') {
      response = await state.agixt.renameConversation(state.agent, state.overrides.conversation);
      // response = await axios.put(
      //   `${process.env.NEXT_PUBLIC_AGIXT_SERVER}/api/conversation`,
      //   {
      //     agent_name: state.agent,
      //     conversation_name: state.overrides?.conversation,
      //     new_name: '-',
      //   },
      //   {
      //     headers: {
      //       Authorization: getCookie('jwt'),
      //     },
      //   },
      // );
      await mutate('/conversation');
      log([response], { client: 1 });
    }
    setLoading(false);
    mutate(conversationSWRPath + response);
    mutate('/user');
    if (chatCompletion?.choices[0]?.message.content.length > 0) {
      return chatCompletion.choices[0].message.content;
    } else {
      return 'Unable to get response from the agent';
    }
  }
  useEffect(() => {
    mutate(conversationSWRPath + state.overrides.conversation);
  }, [state.overrides.conversation]);
  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        mutate(conversationSWRPath + state.overrides.conversation);
      }, 1000);
    }
  }, [loading, state.overrides.conversation]);
  return (
    <>
      <ChatLog
        conversation={conversation.data}
        alternateBackground={alternateBackground}
        setLoading={setLoading}
        loading={loading}
      />
      <ChatBar
        onSend={chat}
        disabled={loading}
        showChatThemeToggles={showChatThemeToggles}
        enableFileUpload={enableFileUpload}
        enableVoiceInput={enableVoiceInput}
        loading={loading}
        setLoading={setLoading}
        showOverrideSwitchesCSV={showOverrideSwitchesCSV}
        showResetConversation={
          process.env.NEXT_PUBLIC_AGIXT_SHOW_CONVERSATION_BAR !== 'true' &&
          process.env.NEXT_PUBLIC_AGIXT_CONVERSATION_MODE === 'uuid'
        }
      />
    </>
  );
}
