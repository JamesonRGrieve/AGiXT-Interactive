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

export default function TrainPanel({
  data,
  collectionNumber = 0,
  limit = 10,
  minRelevanceScore = 0.0,
}) {
  const router = useRouter();
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
          <Tab label="Website Training" selected={tab == 0} />
          <Tab label="File Training" selected={tab == 1} />
          <Tab label="Text Training" selected={tab == 2} />
          <Tab label="GitHub Repository Training" selected={tab == 3} />
          <Tab label="Memory Management" selected={tab == 4} />
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
