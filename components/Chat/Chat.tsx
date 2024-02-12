import Box from '@mui/material/Box';
import { useTheme } from '@mui/material';
import ConversationHistory from './ChatLog/ConversationHistory';
import ConversationBar from './ChatBar/ConversationBar';
import Header from '../Header';
import { ChatProps } from '../AGiXTChat';
import { useContext, useEffect, useState } from 'react';
import { ChatContext } from '../../types/ChatContext';

export default function Chat({ mode }: ChatProps) {
  const [conversationArray, setConversationArray] = useState([]);
  const state = useContext(ChatContext);
  useEffect(() => {
    console.log("Conversation changed, fetching new conversation's messages.", state.chatSettings.conversationName);
    state.sdk.getConversation('', state.chatSettings.conversationName, 100, 1).then((result) => {
      setConversationArray(result);
    });
  }, [state.chatSettings.conversationName]);
  return (
    <>
      <ConversationHistory conversation={conversationArray} />
      <ConversationBar setConversation={setConversationArray} mode={mode} />
    </>
  );
}
