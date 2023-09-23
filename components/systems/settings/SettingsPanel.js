import { useState, useEffect } from "react";
import { Tab, Tabs, Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/router";
import { useTheme } from "@mui/material/styles";
import ContentSWR from "../../data/ContentSWR";
import AgentConfigure from "./tabs/AgentConfigure";
import AgentAdmin from "./tabs/AgentAdmin";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

export default function SettingsPanel({ agent }) {
  const router = useRouter();
  const [tab, setTab] = useState(router.query.tab || "0");
  const agentName = router.query.agent;
  const handleExport = async () => {
    // Download the content of data to a json file with the agentname.json
    const filename = `${agentName}.json`;
    const contentType = "application/json;charset=utf-8;";
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      var blob = new Blob(
        [decodeURIComponent(encodeURI(JSON.stringify(data)))],
        { type: contentType }
      );
      navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      var a = document.createElement("a");
      a.download = filename;
      a.href =
        "data:" + contentType + "," + encodeURIComponent(JSON.stringify(data));
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };
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
    <ContentSWR swr={agent} content={AgentConfigure} />,
    <AgentAdmin />,
  ];

  return (
    <>
      <Tabs
        value={tab}
        onChange={handleTabChange}
        TabIndicatorProps={{
          style: {
            background: theme.palette.mode == "dark" ? "#FFF" : "#000",
          },
        }}
        sx={{ mb: "0.5rem" }}
        textColor={theme.palette.mode == "dark" ? "white" : "black"}
        allowScrollButtonsMobile={true}
        variant="fullWidth"
      >
        <Tab label="Agent Settings" value="0" wrapped={true} />
        <Tab label="Agent Administration" value="1" wrapped={true} />
      </Tabs>
      <Box
        sx={{
          padding: "1rem",
        }}
      >
        <Typography variant="h6" sx={{ my: "1rem" }}>
          {agentName} Agent Configuration&nbsp;&nbsp;
          <Button color="info" onClick={handleExport}>
            <FileDownloadOutlinedIcon color="info" /> Export Agent
          </Button>
        </Typography>
        {tabs[tab]}
      </Box>
    </>
  );
}
