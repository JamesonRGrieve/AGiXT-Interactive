import { useState, useEffect } from "react";
import { Tab, Tabs } from "@mui/material";
import { useRouter } from "next/router";
import AgentAdmin from "./tabs/AgentAdmin";
import AgentConfigure from "./tabs/AgentConfigure";
import AgentPrompt from "./tabs/AgentPrompt";
import MemoryManagement from "../memory/MemoryManagement";
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
    <AgentPrompt key="chat" mode="Chat" />,
    <AgentPrompt key="prompt" mode="Prompt" />,
    <AgentPrompt key="instruct" mode="instruct" />,
    <AgentPrompt key="chainExecution" mode="instruct" />, // Placeholder
    <AgentConfigure key="config" data={agentConfigData || data} />,
    <MemoryManagement key="memory" />,
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
        <Tab label="Memory Management" />
        <Tab label="Modify Agent" />
      </Tabs>
      {tabs[tab]}
    </>
  );
}
