import { useRouter } from "next/router";
import { useMemo } from "react";
import useSWR from "swr";
import TrainControl from "../../components/systems/train/TrainControl";
import ContentSWR from "../../components/data/ContentSWR";
import { sdk } from "../../lib/apiClient";
export default function Train() {
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
  return <ContentSWR swr={agent} content={TrainControl} />;
}
