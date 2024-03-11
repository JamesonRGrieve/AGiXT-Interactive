import React from 'react';
import AGiXTChat from '../components/AGiXTChat';
import { cookies } from 'next/headers';

import SearchParamWrapper from '../components/SearchParamWrapper';
export default function Home() {
  /*
  const [apiKey, setApiKey] = useState(getCookie('apiKey'));
  const [loggedIn, setLoggedIn] = useState(getCookie('apiKey') ? true : false);
  const handleSetApiKey = () => {
    setCookie('apiKey', apiKey);
    setLoggedIn(true);
  };
  */
  const cookieStore = cookies();

  const loggedIn = true;
  return process.env.NEXT_PUBLIC_AGIXT_REQUIRE_API_KEY === 'true' && !loggedIn ? /*
    <div>
      <h1>AGiXT Chat</h1>
      <p>Please enter your API key to continue. You can find your API key in the AGiXT portal.</p>
      <input type='text' value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
      <button onClick={() => handleSetApiKey()}>Set API Key</button>
    </div>
  */ null : process.env.NEXT_PUBLIC_AGIXT_ENABLE_SEARCHPARAM_CONFIG ? (
    <SearchParamWrapper
      showAppBar={process.env.NEXT_PUBLIC_AGIXT_SHOW_APP_BAR === 'true'} // Show the conversation selection bar to create, delete, and export conversations
      showConversationSelector={process.env.NEXT_PUBLIC_AGIXT_SHOW_CONVERSATION_BAR === 'true'} // Show the conversation selection bar to create, delete, and export conversations
      mode={
        (process.env.NEXT_PUBLIC_AGIXT_MODE && ['chain', 'prompt'].includes(process.env.NEXT_PUBLIC_AGIXT_MODE)
          ? process.env.NEXT_PUBLIC_AGIXT_MODE
          : 'prompt') as 'chain' | 'prompt'
      }
    />
  ) : (
    <AGiXTChat
      uiConfig={{
        showAppBar: process.env.NEXT_PUBLIC_AGIXT_SHOW_APP_BAR === 'true', // Show the conversation selection bar to create, delete, and export conversations
        showConversationSelector: process.env.NEXT_PUBLIC_AGIXT_SHOW_CONVERSATION_BAR === 'true', // Show the conversation selection bar to create, delete, and export conversations
        showRLHF: false,
        showChatThemeToggles: true,
        footerMeessage: process.env.NEXT_PUBLIC_AGIXT_FOOTER_MESSAGE || 'Powered by AGiXT',
      }}
      chatConfig={{
        mode: (process.env.NEXT_PUBLIC_AGIXT_MODE && ['chain', 'prompt'].includes(process.env.NEXT_PUBLIC_AGIXT_MODE)
          ? process.env.NEXT_PUBLIC_AGIXT_MODE
          : 'prompt') as 'chain' | 'prompt',
      }}
    />
  );
}
