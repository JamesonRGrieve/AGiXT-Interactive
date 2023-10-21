import AGiXTChat from "../components/AGiXTChat";

export default function Home({
  AGiXTServer = "http://localhost:7437",
  agentName = "gpt4free",
  insightAgent = "gpt4free",
  conversationName = "Test",
  setConversationName = () => {},
  showConversationBar = true,
  dark = true,
  fileUploadEnabled = false,
  mode = "prompt",
  promptName = "Chat",
  promptCategory = "Default",
  selectedChain = "Postgres Chat",
  chainArgs = {},
  useSelectedAgent = true,
}) {
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
