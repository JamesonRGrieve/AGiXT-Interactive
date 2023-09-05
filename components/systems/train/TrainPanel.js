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
      <Container>
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

        <FormControlLabel
          control={
            <Checkbox
              checked={advancedOptions}
              onChange={() => setAdvancedOptions(!advancedOptions)}
              name="advancedOptions"
              color="primary"
            />
          }
          label="Advanced Options"
        />

        {advancedOptions && (
          <div className="advanced-options">
            <Typography variant="h6" component="h2" gutterBottom>
              <strong>Predefined Memory Collections</strong>
            </Typography>
            <Typography component="h2" gutterBottom>
              You can use any number above 10 for your own custom collections,
              but 0-10 are reserved for the following collections:
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Collection Number</TableCell>
                  <TableCell>Collection Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>0</TableCell>
                  <TableCell>Default long term memory storage</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>1</TableCell>
                  <TableCell>Websearch storage</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2</TableCell>
                  <TableCell>RLHF - Positive Feedback memory storage</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>3</TableCell>
                  <TableCell>RLHF - Negative Feedback memory storage</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>4-10</TableCell>
                  <TableCell>Reserved for future use.</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <br />
            <TextField
              fullWidth
              variant="outlined"
              label="Choose a Collection Number (Default is 0)"
              value={collectionNumber}
              onChange={(e) => {
                setCollectionNumber(e.target.value);
              }}
            />
            {tab == 4 && (
              <>
                <TextField
                  type="number"
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  label="Limit"
                  variant="outlined"
                  margin="normal"
                  style={{ width: "130px" }}
                />
                <TextField
                  type="number"
                  value={minRelevanceScore}
                  onChange={(e) => {
                    let value = parseFloat(e.target.value);
                    if (value < 0) value = 0;
                    if (value > 1) value = 1;
                    setMinRelevanceScore(value);
                  }}
                  label="Minimum Relevance Score"
                  variant="outlined"
                  margin="normal"
                  inputProps={{
                    step: 0.1, // Allow only increments or decrements of 0.1
                    min: 0.1, // Minimum value
                    max: 1, // Maximum value
                  }}
                  style={{ width: "200px" }}
                />
              </>
            )}
          </div>
        )}

        <br />
        {tabs[tab]}
      </Container>
    </>
  );
}
