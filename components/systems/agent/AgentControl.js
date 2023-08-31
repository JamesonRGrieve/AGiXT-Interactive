import { useRouter } from "next/router";
import { useMemo } from "react";
import useSWR from "swr";
import AgentPanel from "./AgentPanel";
import PopoutDrawerWrapper from "../../menu/PopoutDrawerWrapper";
import AgentCommandsList from "./AgentCommandList";
import MenuAgentList from "./AgentList";
import { sdk } from "../../../lib/apiClient";

export default function AgentControl({ data }) {
  const router = useRouter();
  // TODO: Make sure any references to router.query are done using memo so that renames don't break calls.
  const agentName = useMemo(() => router.query.agent, [router.query.agent]);
  const tab = router.query.tab;
  const agents = useSWR("agent", async () => sdk.getAgents());

  const commands = useSWR(
    `agent/${agentName}/commands`,
    async () => await sdk.getCommands(agentName)
  );

  return (
    <>
      {tab == 2 && (
        <PopoutDrawerWrapper
          title={"Agent Interactions with " + agentName}
          leftHeading={"Agents"}
          leftSWR={agents}
          leftMenu={MenuAgentList}
          rightHeading={`${agentName} Commands`}
          rightSWR={commands}
          rightMenu={AgentCommandsList}
        >
          <AgentPanel data={data} />
        </PopoutDrawerWrapper>
      )}
      {tab != 2 && (
        <PopoutDrawerWrapper
          title={"Agent Interactions with " + agentName}
          leftHeading={"Agents"}
          leftSWR={agents}
          leftMenu={MenuAgentList}
        >
          <AgentPanel data={data} />
        </PopoutDrawerWrapper>
      )}
    </>
  );
}
