import { useContext, useEffect, useState } from 'react';
import useSWR, { mutate } from 'swr';
import { ChatProps, UIProps } from '../AGiXTChat';
import { ChatContext } from '../../types/ChatContext';
import ConversationHistory from './ChatLog/ConversationHistory';
import ConversationBar from './ChatBar/ConversationBar';

export default function Chat({ mode, showChatThemeToggles }: ChatProps & UIProps): React.JSX.Element {
  console.log('Chat Themes: ', showChatThemeToggles);

  const [latestMessage, setLatestMessage] = useState('');
  const state = useContext(ChatContext);
  const conversation = useSWR(
    '/conversation/' + state.chatSettings.conversationName,
    async () => await state.sdk.getConversation('', state.chatSettings.conversationName, 100, 1),
    {
      fallbackData: [],
    },
  );
  useEffect(() => {
    console.log("Conversation changed, fetching new conversation's messages.", state.chatSettings.conversationName);
    mutate('/conversation/' + state.chatSettings.conversationName);
  }, [state.chatSettings.conversationName]);
  return (
    <>
      <ConversationHistory conversation={conversation.data} latestMessage={latestMessage} />
      <ConversationBar
        setLatestMessage={setLatestMessage}
        latestMessage={latestMessage}
        mode={mode}
        showChatThemeToggles={showChatThemeToggles}
      />
    </>
  );
}
