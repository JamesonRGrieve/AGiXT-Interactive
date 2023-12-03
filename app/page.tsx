'use client';
import { setCookie, getCookie } from 'cookies-next';
import React, { useEffect, useState } from 'react';
import AGiXTChat from '../components/AGiXTChat';
import { useTheme } from '@mui/material';

export default function Home() {
  const [apiKey, setApiKey] = useState(getCookie('apiKey'));
  const [loggedIn, setLoggedIn] = useState(getCookie('apiKey') ? true : false);
  const [conversationName, setConversationName] = useState();
  useEffect(() => {
    console.log("Setting conversation name cookie.", conversationName);
    setCookie('conversationName', conversationName);
  }, [conversationName]);
  const handleSetApiKey = () => {
    setCookie('apiKey', apiKey);
    setLoggedIn(true);
  };
  const theme = useTheme();
  if (!loggedIn) {
    return (
      <div>
        <h1>AGiXT Chat</h1>
        <p>Please enter your API key to continue. You can find your API key in the AGiXT portal.</p>
        <input type='text' value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
        <button onClick={() => handleSetApiKey()}>Set API Key</button>
      </div>
    );
  } else {
    return (
      <AGiXTChat
        showAppBar={process.env.NEXT_PUBLIC_AGIXT_SHOW_APP_BAR === 'true'} // Show the conversation selection bar to create, delete, and export conversations
        showConversationSelector={process.env.NEXT_PUBLIC_AGIXT_SHOW_CONVERSATION_BAR === 'true'} // Show the conversation selection bar to create, delete, and export conversations
        mode={
          (['chat', 'instruct', 'chain', 'prompt'].includes(process.env.NEXT_PUBLIC_AGIXT_MODE)
            ? process.env.NEXT_PUBLIC_AGIXT_MODE
            : 'chat') as 'chat' | 'instruct' | 'chain' | 'prompt'
        }
        theme={theme}
      />
    );
  }
}
