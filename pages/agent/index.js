import { useRouter } from "next/router";
import { useMemo } from "react";
import useSWR from "swr";
import AgentPanel from "../../components/systems/agent/AgentPanel";
import ContentSWR from "../../components/data/ContentSWR";
import { sdk } from "../../lib/apiClient";
import ReactMarkdown from "react-markdown";
import { Container } from "@mui/material";
import axios from "axios";

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
}) {
  const docs = useSWR(
    "docs/agent",
    async () =>
      (
        await axios.get(
          "https://raw.githubusercontent.com/Josh-XT/AGiXT/main/docs/2-Concepts/9-Agent%20Interactions.md"
        )
      ).data
  );

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
      />
    );
  } else {
    return (
      <Container>
        <ContentSWR
          swr={docs}
          content={({ data }) => <ReactMarkdown>{data}</ReactMarkdown>}
        />
      </Container>
    );
  }
}
