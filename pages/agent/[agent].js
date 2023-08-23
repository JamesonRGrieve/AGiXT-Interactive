import { useRouter } from "next/router";
import axios from "axios";
import useSWR from "swr";
import AgentControl from "../../components/systems/agent/AgentControl";
import ContentSWR from "../../components/data/ContentSWR";
import { sdk } from "../../lib/apiClient";
export default function Agent() {
  const agentName = useRouter().query.agent;
  const agent = useSWR(
    `agent/${agentName}`,
    async () => await sdk.getAgent(agentName)
  );
  return <ContentSWR swr={agent} content={AgentControl} />;
}
