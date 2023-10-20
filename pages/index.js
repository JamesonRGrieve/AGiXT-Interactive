import AGiXTChat from "../components/AGiXTChat";
import { useState } from "react";

export default function Home() {
  const [conversationName, setConversationName] = useState(
    "Convert Extensions to new ones"
  );
  return (
    <AGiXTChat
      baseUri={"http://localhost:7437"} // Base URI to the AGiXT server
      dark={true} // Set dark mode by default
      agentName={"gpt4free"} // Agent name
      insightAgent={""} // Insight agent name to use a different agent for insights, leave blank to use the same agent
      mode={"prompt"} // Modes are prompt or chain
      showConversationBar={true} // Show the conversation selection bar to create, delete, and export conversations
      conversationName={conversationName}
      setConversationName={setConversationName}
      enableFileUpload={false} // Enable file upload button
      // If mode is prompt, set promptName and promptCategory
      promptName={"Chat"} // Only matters if mode is prompt
      promptCategory={"Default"} // Only matters if mode is prompt
      // If mode is chain, set the remaining args
      selectedChain={"Smart Chat"} // Only matters if mode is chain
      chainArgs={{}} // Only matters if mode is chain, these are chain arg overrides
      useSelectedAgent={true} // Only matters if mode is chain, this will force the selected agent to run all chain steps
    />
  );
}
