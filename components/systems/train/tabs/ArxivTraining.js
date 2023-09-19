import {
  Button,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Container,
} from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/router";
import { sdk } from "../../../../lib/apiClient";

export default function ArxivTraining({ collectionNumber = 0 }) {
  const [text, setText] = useState("");
  const router = useRouter();
  const [learnStatus, setLearnStatus] = useState("");
  const [userInput, setUserInput] = useState("");
  const [useArticleNumbers, setUseArticleNumbers] = useState(false);
  const [maxResults, setMaxResults] = useState(5);
  const agentName = router.query.agent;

  const onTrain = async (text) => {
    setLearnStatus("Please wait...");
    if (useArticleNumbers) {
      const articles = userInput.replace(/\s/g, "");
      await sdk.learnArxiv(agentName, "", articles, 5, collectionNumber);
    } else {
      await sdk.learnArxiv(
        agentName,
        userInput,
        "",
        maxResults,
        collectionNumber
      );
    }
    setLearnStatus(
      `${agentName} has finished learning from the arXiv articles.`
    );
    setText("");
  };

  return (
    <>
      <Typography>
        You can either enter a search query or enter specific article numbers to
        read into the agents long term memory.
      </Typography>
      <br />
      <FormControlLabel
        control={
          <Checkbox
            checked={useArticleNumbers}
            onChange={(e) => setUseArticleNumbers(e.target.checked)}
          />
        }
        label="Use specific article numbers instead of search query"
      />
      <br />
      {!useArticleNumbers ? ( // Max results number field if it is a query
        <>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter a search query to use on arXiv.org"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <br />
          &nbsp;
          <br />
          <TextField
            fullWidth
            type="number"
            variant="outlined"
            label="Maximum articles to learn from"
            value={maxResults}
            onChange={(e) => setMaxResults(e.target.value)}
          />
        </>
      ) : (
        <>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter a comma separated list of article numbers to use on arXiv.org"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
        </>
      )}
      <br />
      <br />
      <Button variant="contained" color="primary" onClick={() => onTrain(text)}>
        Train from arXiv Articles
      </Button>
      <Typography>{learnStatus}</Typography>
    </>
  );
}
