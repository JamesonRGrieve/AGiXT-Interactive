import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Tab, Tabs } from "@mui/material";
import ChainSteps from "./tabs/ChainSteps";
import ChainAdmin from "./tabs/ChainAdmin";
import ChainSelector from "./ChainSelector";
import { useTheme } from "@mui/material/styles";
import { sdk } from "../../../lib/apiClient";
import useSWR from "swr";

export default function ChainPanel({ commands }) {
  const router = useRouter();
  const chain = router.query.chain;
  const [tab, setTab] = useState(router.query.tab || "0");
  const [selectedChain, setSelectedChain] = useState(chain || "Smart Chat");
  const handleTabChange = (event, newTab) => {
    setTab(newTab);
  };
  const steps = useSWR(
    "chain/" + router.query.chain,
    async () => await sdk.getChain(router.query.chain)
  );
  const theme = useTheme();
  const tabs = [
    <ChainSteps
      key="steps"
      steps={steps}
      commands={commands}
      selectedChain={selectedChain}
      setSelectedChain={setSelectedChain}
    />,
    <ChainAdmin key="admin" steps={steps} />,
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
        allowScrollButtonsMobile={true}
        variant="fullWidth"
      >
        <Tab label="Modify Chain" value="0" wrapped={true} />
        <Tab label="Chain Administration" value="1" wrapped={true} />
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
