import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Tab, Tabs } from "@mui/material";
import ChainSteps from "./tabs/ChainSteps";
import ChainAdmin from "./tabs/ChainAdmin";
import ChainSelector from "./ChainSelector";
import { useTheme } from "@mui/material/styles";

export default function ChainPanel({ commands }) {
  const router = useRouter();
  const chain = router.query.chain;
  const [tab, setTab] = useState(0);
  const [selectedChain, setSelectedChain] = useState(chain || "Smart Chat");
  const handleTabChange = (event, newTab) => {
    setTab(newTab);
  };

  const theme = useTheme();
  const tabs = [
    <ChainSteps
      key="steps"
      commands={commands}
      selectedChain={selectedChain}
      setSelectedChain={setSelectedChain}
    />,
    <ChainAdmin key="admin" />,
  ];
  useEffect(() => {
    if (selectedChain) {
      router.push(`/chain/${selectedChain}?agent=${router.query.agent}`);
    }
    setSelectedChain(selectedChain);
  }, [chain, selectedChain]);

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
        <Tab label="Manage Chain Steps" />
        <Tab label="Administrate Chain" />
      </Tabs>
      <ChainSelector
        selectedChain={selectedChain}
        setSelectedChain={setSelectedChain}
        onChange={(e) => setSelectedChain(e.target.value)}
      />
      {tabs[tab]}
    </>
  );
}
