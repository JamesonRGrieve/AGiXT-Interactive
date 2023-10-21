import "../styles/globals.css";
import { useState } from "react";
import { getCookie } from "cookies-next";
/* 
All of the following vars are optional and will default to the values below if not set. 
Add desired variables that you want to configure to your .env.local file.

Example of the default vars for the UI:
AGIXT_SERVER=http://localhost:7437
AGIXT_AGENT=gpt4free
AGIXT_INSIGHT_AGENT=gpt4free
AGIXT_CONVERSATION_NAME=Convert Extensions to new ones
AGIXT_SHOW_CONVERSATION_BAR=true
AGIXT_FILE_UPLOAD_ENABLED=false
AGIXT_DARKMODE=true

Prompt mode example (In addition to the default vars):

AGIXT_MODE=prompt
AGIXT_PROMPT_NAME=Chat
AGIXT_PROMPT_CATEGORY=Default

Chain mode example (In addition to the default vars):

AGIXT_MODE=chain
AGIXT_CHAIN=Postgres Chat
AGIXT_CHAIN_ARGS={}
AGIXT_USE_SELECTED_AGENT=true
*/

export default function App({ Component, pageProps }) {
  const showConversationBar = process.env.AGIXT_SHOW_CONVERSATION_BAR || true;
  let convo = process.env.AGIXT_CONVERSATION_NAME;
  if (showConversationBar) {
    const cookieConvo = getCookie("conversationName");
    if (cookieConvo) {
      convo = cookieConvo;
    }
  }
  const [conversationName, setConversationName] = useState(
    convo || "Convert Extensions to new ones"
  );
  const AGiXTServer = process.env.AGIXT_SERVER || "http://localhost:7437";
  const agentName = process.env.AGIXT_AGENT || "gpt4free";
  const insightAgent = process.env.AGIXT_INSIGHT_AGENT || "gpt4free";
  const mode = process.env.AGIXT_MODE || "prompt";
  const selectedChain = process.env.AGIXT_CHAIN || "Postgres Chat";
  const useSelectedAgent = process.env.AGIXT_USE_SELECTED_AGENT || true;
  const promptName = process.env.AGIXT_PROMPT_NAME || "Chat";
  const promptCategory = process.env.AGIXT_PROMPT_CATEGORY || "Default";
  const envChainArgs = process.env.AGIXT_CHAIN_ARGS || "{}";
  const dark = process.env.AGIXT_DARKMODE || true;
  const fileUploadEnabled = process.env.AGIXT_FILE_UPLOAD_ENABLED || false;
  let chainArgs = {};
  try {
    chainArgs = JSON.parse(envChainArgs);
  } catch (e) {
    console.error(e);
  }
  return (
    <Component
      {...pageProps}
      AGiXTServer={AGiXTServer}
      agentName={agentName}
      insightAgent={insightAgent}
      conversationName={conversationName}
      setConversationName={setConversationName}
      showConversationBar={showConversationBar}
      dark={dark}
      enableFileUpload={fileUploadEnabled}
      mode={mode}
      promptName={promptName}
      promptCategory={promptCategory}
      selectedChain={selectedChain}
      chainArgs={chainArgs}
      useSelectedAgent={useSelectedAgent}
    />
  );
}
