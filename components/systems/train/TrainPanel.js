import { useState, useEffect } from "react";
import { Tab, Tabs } from "@mui/material";
import { useRouter } from "next/router";
import WebTraining from "./tabs/WebTraining";
import FileTraining from "./tabs/FileTraining";
import TextTraining from "./tabs/TextTraining";
import GithubTraining from "./tabs/GithubTraining";
import { useTheme } from "@mui/material/styles";
import { sdk } from "../../../lib/apiClient";
import useSWR from "swr";

export default function TrainPanel({ data }) {
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
    <WebTraining />,
    <FileTraining />,
    <TextTraining />,
    <GithubTraining />,
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
        <Tab label="Website Training" />
        <Tab label="File Training" />
        <Tab label="Text Training" />
        <Tab label="GitHub Repository Training" />
      </Tabs>
      {tabs[tab]}
    </>
  );
}
