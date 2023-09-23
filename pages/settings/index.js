import { useRouter } from "next/router";
import { useMemo } from "react";
import SettingsPanel from "../../components/systems/settings/SettingsPanel";
import { sdk } from "../../lib/apiClient";
import useSWR from "swr";
export default function AgentSettings() {
  const router = useRouter();
  const agentName = useMemo(() => router.query.agent, [router.query.agent]);
  const agent = useSWR(
    agentName ? `agent/${agentName}` : null,
    async () => await sdk.getAgentConfig(agentName)
  );

  return <SettingsPanel agent={agent} />;
}
