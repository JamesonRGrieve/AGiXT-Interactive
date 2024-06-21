import { useContext, useEffect, useState } from 'react';
import useSWR, { mutate } from 'swr';
import { UIProps } from '../InteractiveAGiXT';
import { InteractiveConfigContext, Overrides } from '../../types/InteractiveConfigContext';
import ChatLog from './ChatLog';
import ChatBar from './ChatBar';

const conversationSWRPath = /conversation/;
export default function Chat({
  showChatThemeToggles,
  alternateBackground,
  enableFileUpload,
  enableVoiceInput,
}: Overrides & UIProps): React.JSX.Element {
  // console.log('Chat Themes: ', showChatThemeToggles);
  const [loading, setLoading] = useState(false);

  const state = useContext(InteractiveConfigContext);

  const conversation = useSWR(
    conversationSWRPath + state.overrides.conversationName,
    async () => await state.agixt.getConversation(state.overrides.conversationName, 100, 1),
    {
      fallbackData: [],
      refreshInterval: loading ? 1000 : 0,
    },
  );
  async function chat(message, files): Promise<string> {
    const messages = [];
    // console.log(message);
    if (typeof message === 'object' && message.type === 'audio_url') {
      messages.push({
        role: 'user',
        content: [message],
      });
    } else {
      if (Object.keys(files).length > 0) {
        const fileContents = Object.entries(files).map(([fileName, fileContent]: [string, string]) => ({
          type: `${fileContent.split(':')[1].split('/')[0]}_url`,
          file_name: fileName,
          [`${fileContent.split(':')[1].split('/')[0]}_url`]: {
            url: fileContent,
          },
        }));
        messages.push({
          role: 'user',
          content: [
            { type: 'text', text: message },
            ...fileContents, // Spread operator to include all file contents
          ],
        });
      } else {
        messages.push({ role: 'user', content: message });
      }
    }

    const toOpenAI = {
      messages: messages,
      model: state.agent,
      user: state.overrides.conversationName,
    };
    setLoading(true);
    console.log('Sending: ', state.openai, toOpenAI);
    const req = state.openai.chat.completions.create(toOpenAI);
    await new Promise((resolve) => setTimeout(resolve, 100));
    mutate(conversationSWRPath + state.overrides.conversationName);
    const chatCompletion = await req;
    setLoading(false);
    mutate(conversationSWRPath + state.overrides.conversationName);
    if (chatCompletion?.choices[0]?.message.content.length > 0) {
      return chatCompletion.choices[0].message.content;
    } else {
      return 'Unable to get response from the agent';
    }
  }
  useEffect(() => {
    // console.log("Conversation changed, fetching new conversation's messages.", state.overrides.conversationName);
    mutate(conversationSWRPath + state.overrides.conversationName);
  }, [state.overrides.conversationName]);
  return (
    <>
      <ChatLog conversation={conversation.data} alternateBackground={alternateBackground} setLoading={setLoading} />
      <ChatBar
        onSend={(message, files) => chat(message, files)}
        disabled={loading}
        showChatThemeToggles={showChatThemeToggles}
        enableFileUpload={enableFileUpload}
        enableVoiceInput={enableVoiceInput}
        loading={loading}
        setLoading={setLoading}
      />
    </>
  );
}
