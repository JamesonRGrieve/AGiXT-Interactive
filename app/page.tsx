'use client';
import React, { useEffect, useState } from 'react';
import AGiXTChat from '../components/AGiXTChat';
import { useTheme } from '@mui/material';
import {setCookie, getCookie} from 'cookies-next';

export default function Home() {
  const [apiKey, setApiKey] = useState(getCookie('apiKey'));
  const [loggedIn, setLoggedIn] = useState(getCookie('apiKey') ? true : false);

  const handleSetApiKey = () => {
    setCookie('apiKey',apiKey);
    setLoggedIn(true);
  };
  const theme = useTheme();
  console.log("Cookie domain", process.env.NEXT_PUBLIC_COOKIE_DOMAIN);
  if (!getCookie('uuid')) {
    setCookie('uuid', crypto.randomUUID(), {domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN, maxAge: 2147483647 });
  }
  if (!loggedIn && process.env.NEXT_PUBLIC_AGIXT_REQUIRE_API_KEY === 'true') {
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
          (process.env.NEXT_PUBLIC_AGIXT_MODE && ['chain', 'prompt'].includes(process.env.NEXT_PUBLIC_AGIXT_MODE)
            ? process.env.NEXT_PUBLIC_AGIXT_MODE
            : 'prompt') as 'chain' | 'prompt'
        }
        theme={theme}
      />
    );
  }
}
