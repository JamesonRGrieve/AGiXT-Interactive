import { useRouter } from "next/router";
import { useMemo } from "react";
import useSWR from "swr";
import TrainPanel from "./TrainPanel";
import PopoutDrawerWrapper from "../../menu/PopoutDrawerWrapper";
import MenuAgentList from "../agent/AgentList";
import { sdk } from "../../../lib/apiClient";

export default function AgentControl({ data }) {
  const router = useRouter();
  const agentName = useMemo(() => router.query.train, [router.query.train]);
  const tab = useMemo(() => router.query.tab, [router.query.tab]);
  const agents = useSWR("agent", async () => sdk.getAgents());

  return (
    <>
      <PopoutDrawerWrapper
        title={"Agent Training for " + agentName}
        leftHeading={"Agents"}
        leftSWR={agents}
        leftMenu={MenuAgentList}
      >
        <TrainPanel data={data} />
      </PopoutDrawerWrapper>
    </>
  );
}
