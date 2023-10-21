import AGiXTChat from "../components/AGiXTChat";
import { useState } from "react";
import { getCookie } from "cookies-next";

export default function Home() {
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
    <AGiXTChat
      baseUri={AGiXTServer} // Base URI to the AGiXT server
      agentName={agentName} // Agent name
      insightAgent={insightAgent} // Insight agent name to use a different agent for insights, leave blank to use the same agent
      conversationName={conversationName} // Conversation name
      setConversationName={setConversationName} // Function to set the conversation name
      // UI Options
      showConversationBar={showConversationBar} // Show the conversation selection bar to create, delete, and export conversations
      dark={dark} // Set dark mode by default
      enableFileUpload={fileUploadEnabled} // Enable file upload button, disabled by default.
      // Modes are prompt or chain
      mode={mode}
      // prompt mode - Set promptName and promptCategory
      promptName={promptName} // Only matters if mode is prompt
      promptCategory={promptCategory} // Only matters if mode is prompt
      // chain mode - Set chain name and chain args
      selectedChain={selectedChain} // Chain name
      chainArgs={chainArgs} // Chain arg overrides, unnecessary if you don't need to override any args.
      useSelectedAgent={useSelectedAgent} // Will force the selected agent to run all chain steps rather than the agents defined in the chain
    />
  );
}
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
