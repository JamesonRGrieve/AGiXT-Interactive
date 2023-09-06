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
  const tab = useMemo(() => router.query.tab, [router.query.tab]);
  const agents = useSWR("agent", async () => sdk.getAgents());

  const commands = useSWR(
    `agent/${agentName}/commands`,
    async () => await sdk.getCommands(agentName)
  );

  return (
    <>
      {tab == 4 && (
        <PopoutDrawerWrapper
          title={`Agent Settings for ${agentName}`}
          rightHeading={`Commands`}
          rightSWR={commands}
          rightMenu={AgentCommandsList}
        >
          <AgentPanel data={data} />
        </PopoutDrawerWrapper>
      )}
      {tab != 4 && (
        /* Will need to change these tabs from being numbers to actual names.
      Plan here will be to have different settings for each tab. For example:
        Chat(0)/Prompt(1)/Instruct(2) modes will have advanced settings for:
          Conversation interactions to inject (5)
          Shots - How many times it runs the prompt (1)
          Inject memories from additional collection number (0)
          How many memories to inject (contextResults = 5)
          Browse links in user input (False)
          Enable websearch (False)
          Enable memory training (False)
        Chain Execution(3) will have:
          Override settings for each variable rather it is a prompt variable or command variable from the chain. (Will be on the chain execution page rather than side menu)  
          Use agents from chain instead of selected agent (False)
          Option to run a single step (False, spawn a new number box for step number if true default to 1)
          Option to start from a specified step. (False, spawn a new number box for step number if true default to 1)
          Option to show all responses instead of only the last response (False)
        */

        <AgentPanel data={data} />
      )}
    </>
  );
}
