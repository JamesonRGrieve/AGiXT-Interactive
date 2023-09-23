import { useRouter } from "next/router";
import { useMemo } from "react";
import AgentPanel from "../../components/systems/agent/AgentPanel";

export default function Agents({
  chains,
  selectedChain,
  setSelectedChain,
  chainArgs,
  contextResults = 5,
  shots = 1,
  browseLinks = false,
  websearch = false,
  websearchDepth = 0,
  enableMemory = false,
  injectMemoriesFromCollectionNumber = 0,
  conversationResults = 5,
  useSelectedAgent,
  setUseSelectedAgent,
  theme,
  setConversationName,
  conversationName,
  setConversations,
}) {
  const router = useRouter();
  const agentName = useMemo(() => router.query.agent, [router.query.agent]);
  if (agentName) {
    return (
      <AgentPanel
        chains={chains}
        selectedChain={selectedChain}
        setSelectedChain={setSelectedChain}
        chainArgs={chainArgs}
        contextResults={contextResults}
        shots={shots}
        browseLinks={browseLinks}
        websearch={websearch}
        websearchDepth={websearchDepth}
        enableMemory={enableMemory}
        injectMemoriesFromCollectionNumber={injectMemoriesFromCollectionNumber}
        conversationResults={conversationResults}
        useSelectedAgent={useSelectedAgent}
        setUseSelectedAgent={setUseSelectedAgent}
        theme={theme}
        setConversationName={setConversationName}
        conversationName={conversationName}
        setConversations={setConversations}
      />
    );
  } else {
    router.push("/");
  }
}
