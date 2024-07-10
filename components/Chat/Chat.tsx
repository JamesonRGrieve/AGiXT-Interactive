'use client';
import { useCallback, useContext, useEffect, useState } from 'react';
import useSWR, { mutate } from 'swr';
import { UIProps } from '../InteractiveAGiXT';
import { InteractiveConfigContext, Overrides } from '../../types/InteractiveConfigContext';
import ChatLog from './ChatLog';
import ChatBar from './ChatBar';
import { RuleFolderRounded } from '@mui/icons-material';
import { get } from 'http';
import { getCookie } from 'cookies-next';

export async function getAndFormatConversastion(state): Promise<any[]> {
  const rawConversation = await state.agixt.getConversation(state.overrides.conversation, 100, 1);
  //console.log('Raw conversation: ', rawConversation);
  return rawConversation.reduce((accumulator, currentMessage: { id: string; message: string }) => {
    const messageType = currentMessage.message.split(' ')[0];
    // console.log('Message type: ', messageType);
    if (messageType.startsWith('[SUBACTIVITY]')) {
      let target;
      const parent = messageType.split('[')[2].split(']')[0];
      // console.log('Subactivity with parent: ', parent);
      // console.log('Accumulator: ', accumulator);
      // console.log('Current message: ', currentMessage);
      // console.log('Accumulator at 0', accumulator[0]);
      const parentIndex = accumulator.findIndex((message) => {
        //console.log('Checking message', message);
        return message.id === parent || message.children.some((child) => child.id === parent);
      });
      if (parentIndex !== -1) {
        if (accumulator[parentIndex].id === parent) {
          target = accumulator[parentIndex];
          // console.log("Found top level parent's index: ", parentIndex, accumulator[parentIndex]);
        } else {
          target = accumulator[parentIndex].children.find((child) => child.id === parent);
          // console.log("Found child parent's index: ", parentIndex, accumulator[parentIndex], target);
        }
        // console.log(target);
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
  enableMessageDeletion,
  enableMessageEditing,
  showOverrideSwitchesCSV,
  showRLHF,
}: Overrides & UIProps): React.JSX.Element {
  // console.log('Chat Themes: ', showChatThemeToggles);
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
  //console.log(conversation.data);
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
      ...(getCookie('agixt-create-image') ? { create_image: getCookie('agixt-create-image') } : {}),
      ...(getCookie('agixt-tts') ? { tts: getCookie('agixt-tts') } : {}),
      ...(getCookie('agixt-websearch') ? { websearch: getCookie('agixt-websearch') } : {}),
    });

    const toOpenAI = {
      messages: messages,
      model: state.agent,
      user: state.overrides.conversation,
    };
    setLoading(true);
    console.log('Sending: ', state.openai, toOpenAI);
    const req = state.openai.chat.completions.create(toOpenAI);
    await new Promise((resolve) => setTimeout(resolve, 100));
    mutate(conversationSWRPath + state.overrides.conversation);
    const chatCompletion = await req;
    let response;
    if (state.overrides.conversation === '-') {
      response = await state.agixt.renameConversation(state.agent, state.overrides.conversation);
      await mutate('/conversation');
      console.log(response);
      if (!response.startsWith('Error')) {
        state.mutate((oldState) => {
          return {
            ...oldState,
            overrides: {
              ...oldState.overrides,
              conversation: response,
            },
          };
        });
      }
    }
    setLoading(false);
    mutate(conversationSWRPath + response);
    if (chatCompletion?.choices[0]?.message.content.length > 0) {
      return chatCompletion.choices[0].message.content;
    } else {
      return 'Unable to get response from the agent';
    }
  }
  useEffect(() => {
    // console.log("Conversation changed, fetching new conversation's messages.", state.overrides.conversation);
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
        showRLHF={showRLHF}
        enableMessageDeletion={enableMessageDeletion}
        enableMessageEditing={enableMessageEditing}
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
