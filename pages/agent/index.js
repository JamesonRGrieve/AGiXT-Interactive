import { useRouter } from "next/router";
import { useMemo } from "react";
import useSWR from "swr";
import AgentPanel from "../../components/systems/agent/AgentPanel";
import ContentSWR from "../../components/data/ContentSWR";
import { sdk } from "../../lib/apiClient";
import ReactMarkdown from "react-markdown";
import { Container } from "@mui/material";
import axios from "axios";

export default function Home() {
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
  const agent = useSWR(
    agentName ? `agent/${agentName}` : null,
    async () => await sdk.getAgentConfig(agentName),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  if (agentName) {
    return <ContentSWR swr={agent} content={AgentPanel} />;
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
