'use client';
import { setCookie, getCookie } from 'cookies-next';
import React, { useEffect, useState } from 'react';
import AGiXTChat from '../components/AGiXTChat';

export default function Home() {
  const [apiKey, setApiKey] = useState(getCookie('apiKey'));
  const [loggedIn, setLoggedIn] = useState(getCookie('apiKey') ? true : false);
  const [conversationName, setConversationName] = useState(
    getCookie('conversationName') || process.env.NEXT_PUBLIC_AGIXT_CONVERSATION_NAME
  );
  useEffect(() => {
    setCookie('conversationName', conversationName);
  }, [conversationName]);
  const handleSetApiKey = () => {
    setCookie('apiKey', apiKey);
    setLoggedIn(true);
  };

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
        baseUri={process.env.NEXT_PUBLIC_AGIXT_SERVER} // Base URI to the AGiXT server
        agentName={process.env.NEXT_PUBLIC_AGIXT_AGENT} // Agent name
        insightAgent={process.env.NEXT_PUBLIC_AGIXT_INSIGHT_AGENT} // Insight agent name to use a different agent for insights, leave blank to use the same agent
        conversationName={conversationName || process.env.NEXT_PUBLIC_AGIXT_CONVERSATION_NAME} // Conversation name
        // UI Options
        showAppBar={process.env.NEXT_PUBLIC_AGIXT_SHOW_APP_BAR === 'true'} // Show the conversation selection bar to create, delete, and export conversations
        showConversationSelector={process.env.NEXT_PUBLIC_AGIXT_SHOW_CONVERSATION_BAR === 'true'} // Show the conversation selection bar to create, delete, and export conversations
        enableFileUpload={process.env.NEXT_PUBLIC_AGIXT_FILE_UPLOAD_ENABLED === 'true'} // Enable file upload button, disabled by default.
        // Modes are prompt or chain
        mode={process.env.NEXT_PUBLIC_AGIXT_MODE}
        // prompt mode - Set promptName and promptCategory
        promptName={process.env.NEXT_PUBLIC_AGIXT_PROMPT_NAME} // Name of the prompt to use
        promptCategory={process.env.NEXT_PUBLIC_AGIXT_PROMPT_CATEGORY} // Category of the prompt to use
        // chain mode - Set chain name and chain args
        selectedChain={process.env.NEXT_PUBLIC_AGIXT_CHAIN} // Chain name
        chainArgs={JSON.parse(process.env.NEXT_PUBLIC_AGIXT_CHAIN_ARGS ?? '{}')} // Chain arg overrides, unnecessary if you don't need to override any args.
        useSelectedAgent={process.env.NEXT_PUBLIC_AGIXT_USE_SELECTED_AGENT === 'true'} // Will force the selected agent to run all chain steps rather than the agents defined in the chain
      />
    );
  }
}
