import { useRouter } from "next/router";
import { useMemo } from "react";
import AgentConfigure from "../../components/systems/agent/tabs/AgentConfigure";
import AgentCommandsList from "../../components/systems/agent/AgentCommandList";
import { sdk } from "../../lib/apiClient";
import PopoutDrawerWrapper from "../../components/menu/PopoutDrawerWrapper";
import ContentSWR from "../../components/data/ContentSWR";
import useSWR from "swr";
export default function AgentSettings() {
  const router = useRouter();
  const agentName = useMemo(() => router.query.agent, [router.query.agent]);
  const agent = useSWR(
    agentName ? `agent/${agentName}` : null,
    async () => await sdk.getAgentConfig(agentName)
  );
  const commands = useSWR(
    `agent/${agentName}/commands`,
    async () => await sdk.getCommands(agentName),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  return (
    <PopoutDrawerWrapper
      title={`Agent Settings for ${agentName}`}
      rightHeading={`Commands`}
      rightSWR={commands}
      rightMenu={AgentCommandsList}
    >
      <ContentSWR swr={agent} content={AgentConfigure} />
    </PopoutDrawerWrapper>
  );
}
