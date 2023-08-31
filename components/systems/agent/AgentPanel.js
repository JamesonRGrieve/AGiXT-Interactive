import { useState, useEffect } from "react";
import { Tab, Tabs } from "@mui/material";
import { useRouter } from "next/router";
import AgentChat from "./tabs/AgentChat";
import AgentInstruct from "./tabs/AgentInstruct";
import AgentAdmin from "./tabs/AgentAdmin";
import AgentConfigure from "./tabs/AgentConfigure";
import { useTheme } from "@mui/material/styles";
import { sdk } from "../../../lib/apiClient";
import useSWR from "swr";

export default function AgentPanel({ data }) {
  const router = useRouter();
  const agentName = router.query.agent;

  // Use SWR at top level
  const { data: agentConfigData, error } = useSWR(
    agentName ? `agent/${agentName}` : null,
    () => sdk.getAgentConfig(agentName)
  );

  const [tab, setTab] = useState(router.query.tab || 0);

  useEffect(() => {
    // Push the current tab to the router query
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, tab },
      },
      undefined,
      { shallow: true }
    );
  }, [tab]);

  const handleTabChange = (event, newTab) => {
    setTab(newTab);
  };

  const theme = useTheme();

  const tabs = [
    <AgentChat key="chat" />,
    <AgentChat key="prompt" />, // Placeholder
    <AgentInstruct key="instruct" />,
    <AgentInstruct key="chainExecution" />, // Placeholder
    <AgentConfigure key="config" data={agentConfigData || data} />,
    <AgentAdmin key="admin" />,
  ];

  return (
    <>
      <Tabs
        value={tab}
        onChange={handleTabChange}
        TabIndicatorProps={{
          style: { background: theme.palette.mode == "dark" ? "#FFF" : "#000" },
        }}
        sx={{ mb: "0.5rem" }}
        textColor={theme.palette.mode == "dark" ? "white" : "black"}
      >
        <Tab label="Chat Mode" />
        <Tab label="Prompt Mode" />
        <Tab label="Instruct Mode" />
        <Tab label="Chain Execution" />
        <Tab label="Agent Settings" />
        <Tab label="Modify Agent" />
      </Tabs>
      {tabs[tab]}
    </>
  );
}
