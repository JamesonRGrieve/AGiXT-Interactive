import { useState } from "react";
import { Tab, Tabs } from "@mui/material";
import { useRouter } from "next/router";
import AgentChat from "./tabs/AgentChat";
import AgentInstruct from "./tabs/AgentInstruct";
import AgentAdmin from "./tabs/AgentAdmin";
import AgentConfigure from "./tabs/AgentConfigure";
import { useTheme } from "@mui/material/styles";
export default function AgentPanel({ data }) {
  const router = useRouter();
  console.log("Agent config", data);
  const [tab, setTab] = useState(router.query.config == "true" ? 3 : 0);
  const handleTabChange = (event, newTab) => {
    setTab(newTab);
  };
  const theme = useTheme();
  const tabs = [
    <AgentChat key="chat" />,
    <AgentInstruct key="instruct" />,
    <AgentConfigure key="config" data={data} />,
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
        <Tab label="Chat With Agent" />
        <Tab label="Instruct Agent" />
        <Tab label="Agent Settings" />
        <Tab label="Modify Agent" />
      </Tabs>
      {tabs[tab]}
    </>
  );
}
