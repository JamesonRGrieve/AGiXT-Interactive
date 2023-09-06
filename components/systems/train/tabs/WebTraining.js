import { Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/router";
import { sdk } from "../../../../lib/apiClient";

export default function WebTraining({ collectionNumber = 0 }) {
  const [url, setUrl] = useState("");
  const [learnStatus, setLearnStatus] = useState("");
  const router = useRouter();
  const agentName = router.query.agent;

  const onTrain = async (url) => {
    const urls = url.split("\n");
    setLearnStatus(`${agentName} is learning from websites... Please wait.`);
    for (let url of urls) {
      url = url.trim();
      if (url.length == 0) {
        continue;
      }
      await sdk.learnUrl(agentName, url, collectionNumber);
      setLearnStatus(
        `${agentName} is learning from websites... Last URL: ${url}.  Please wait...`
      );
    }
    setLearnStatus(
      `${agentName} has finished learning from the following websites: ${urls.join(
        ", "
      )}.`
    );
    setUrl("");
    router.push(router.asPath);
  };

  return (
    <>
      <Typography>
        The agent will scrape data from the websites you provide into its long
        term memory.
      </Typography>
      <br />
      <TextField
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        placeholder="Enter Website links for the agent to learn from.. (One URL per line)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={() => onTrain(url)}>
        Train from Websites
      </Button>
      <Typography>{learnStatus}</Typography>
    </>
  );
}
