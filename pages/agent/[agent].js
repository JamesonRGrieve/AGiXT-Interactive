import { useRouter } from "next/router";
import { useMemo } from "react";
import useSWR from "swr";
import AgentControl from "../../components/systems/agent/AgentControl";
import ContentSWR from "../../components/data/ContentSWR";
import { sdk } from "../../lib/apiClient";
export default function Agent() {
  const router = useRouter();
  const agentName = useMemo(() => router.query.agent, [router.query.agent]);
  const agent = useSWR(
    `agent/${agentName}`,
    async () => await sdk.getAgentConfig(agentName)
  );
  // Add a loading screen
  return <ContentSWR swr={agent} content={AgentControl} />;
}
