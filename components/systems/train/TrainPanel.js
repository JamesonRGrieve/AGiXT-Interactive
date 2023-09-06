import { useState, useEffect } from "react";
import {
  Tab,
  Tabs,
  TextField,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useRouter } from "next/router";
import WebTraining from "./tabs/WebTraining";
import FileTraining from "./tabs/FileTraining";
import TextTraining from "./tabs/TextTraining";
import GithubTraining from "./tabs/GithubTraining";
import MemoryManagement from "./tabs/MemoryManagement";
import { useTheme } from "@mui/material/styles";

export default function TrainPanel({ data }) {
  const router = useRouter();
  const [tab, setTab] = useState(router.query.tab || 0);
  const [collectionNumber, setCollectionNumber] = useState(0);
  const [advancedOptions, setAdvancedOptions] = useState(false);
  const [limit, setLimit] = useState(10);
  const [minRelevanceScore, setMinRelevanceScore] = useState(0.0);

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
    <WebTraining collectionNumber={collectionNumber} />,
    <FileTraining collectionNumber={collectionNumber} />,
    <TextTraining collectionNumber={collectionNumber} />,
    <GithubTraining collectionNumber={collectionNumber} />,
    <MemoryManagement
      key="memory"
      collectionNumber={collectionNumber}
      minRelevanceScore={minRelevanceScore}
      limit={limit}
    />,
  ];

  return (
    <>
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
        >
          <Tab label="Website Training" />
          <Tab label="File Training" />
          <Tab label="Text Training" />
          <Tab label="GitHub Repository Training" />
          <Tab label="Memory Management" />
        </Tabs>
        <Container>
          <Typography variant="h4" component="h1" gutterBottom>
            {
              [
                "Website Training",
                "File Training",
                "Text Training",
                "GitHub Repository Training",
                "Memory Management",
              ][tab]
            }
          </Typography>
          <br />
          {tabs[tab]}
        </Container>
      </>
    </>
  );
}
