import { useRouter } from "next/router";
import { useMemo } from "react";
import useSWR from "swr";
import AgentPanel from "../../components/systems/agent/AgentPanel";
import ContentSWR from "../../components/data/ContentSWR";
import { sdk } from "../../lib/apiClient";
export default function Agent() {
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
  return <ContentSWR swr={agent} content={AgentPanel} />;
}
