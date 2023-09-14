import { useState, useEffect } from "react";
import { Tab, Tabs, Container, Typography } from "@mui/material";
import { useRouter } from "next/router";
import WebTraining from "./tabs/WebTraining";
import FileTraining from "./tabs/FileTraining";
import TextTraining from "./tabs/TextTraining";
import GithubTraining from "./tabs/GithubTraining";
import MemoryManagement from "./tabs/MemoryManagement";
import { useTheme } from "@mui/material/styles";
import ArxivTraining from "./tabs/ArxivTraining";

export default function TrainPanel({
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
    <ArxivTraining collectionNumber={collectionNumber} />,
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
      >
        <Tab label="Website Training" value="0" selected={tab == 0} wrapped />
        <Tab label="File Training" value="1" selected={tab == 1} wrapped />
        <Tab label="Text Training" value="2" selected={tab == 2} wrapped />
        <Tab
          label="GitHub Repository Training"
          value="3"
          selected={tab == 3}
          wrapped
        />
        <Tab label="arXiv Training" value="5" selected={tab == 5} wrapped />
        <Tab label="Memory Management" value="4" selected={tab == 4} wrapped />
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
              "arXiv Training",
            ][tab]
          }
        </Typography>
        <br />
        {tabs[tab]}
      </Container>
    </>
  );
}
