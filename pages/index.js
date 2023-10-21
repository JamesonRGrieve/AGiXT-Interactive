import AGiXTChat from "../components/AGiXTChat";
import { useState, useEffect } from "react";
import { setCookie, getCookie } from "cookies-next";

export default function Home() {
  let convo = process.env.AGIXT_CONVERSATION_NAME;
  const showConversationBar = process.env.AGIXT_SHOW_CONVERSATION_BAR || true;
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
  const insightAgent = process.env.AGIXT_INSIGHT_AGENT || "";
  const mode = process.env.AGIXT_MODE || "prompt";
  const selectedChain = process.env.AGIXT_CHAIN || "Postgres Chat";
  const useSelectedAgent = process.env.AGIXT_USE_SELECTED_AGENT || true;
  const promptName = process.env.AGIXT_PROMPT_NAME || "Chat";
  const promptCategory = process.env.AGIXT_PROMPT_CATEGORY || "Default";
  const envChainArgs = process.env.AGIXT_CHAIN_ARGS || "{}";
  const dark = process.env.AGIXT_DARKMODE || true;
  let chainArgs = {};
  try {
    chainArgs = JSON.parse(envChainArgs);
  } catch (e) {
    console.error(e);
  }
  useEffect(() => {
    setCookie("conversationName", conversationName);
  }, [conversationName]);
  return (
    <AGiXTChat
      baseUri={AGiXTServer} // Base URI to the AGiXT server
      agentName={agentName} // Agent name
      insightAgent={insightAgent} // Insight agent name to use a different agent for insights, leave blank to use the same agent
      // UI options
      showConversationBar={showConversationBar} // Show the conversation selection bar to create, delete, and export conversations
      dark={dark} // Set dark mode by default
      conversationName={conversationName}
      setConversationName={setConversationName}
      enableFileUpload={false} // Enable file upload button
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
/* Examples of env configurations:
Prompt example:

AGIXT_SERVER=http://localhost:7437
AGIXT_AGENT=gpt4free
AGIXT_MODE=prompt
AGIXT_PROMPT_NAME=Chat
AGIXT_PROMPT_CATEGORY=Default
AGIXT_CONVERSATION_NAME=Convert Extensions to new ones
AGIXT_SHOW_CONVERSATION_BAR=true
AGIXT_DARKMODE=true

Chain example:

AGIXT_SERVER=http://localhost:7437
AGIXT_AGENT=SQLExpert
AGIXT_MODE=chain
AGIXT_CHAIN=Postgres Chat
AGIXT_CHAIN_ARGS={}
AGIXT_USE_SELECTED_AGENT=true
AGIXT_CONVERSATION_NAME=Postgres
AGIXT_SHOW_CONVERSATION_BAR=true
AGIXT_DARKMODE=true
*/
