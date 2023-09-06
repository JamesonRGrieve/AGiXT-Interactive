import { Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/router";
import { sdk } from "../../../../lib/apiClient";

export default function TextTraining({ collectionNumber = 0 }) {
  const [text, setText] = useState("");
  const router = useRouter();
  const [learnStatus, setLearnStatus] = useState("");
  const [userInput, setUserInput] = useState("");
  const agentName = router.query.agent;

  const onTrain = async (text) => {
    setLearnStatus("Please wait...");
    await sdk.learnText(agentName, userInput, text, collectionNumber);
    setLearnStatus(`${agentName} has finished learning from the text.`);
    setText("");
  };

  return (
    <>
      <Typography>
        The agent will read the text you provide into its long term memory.
      </Typography>
      <br />
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Enter some short text, description, keywords, or question to associate the learned text with."
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
      />
      <TextField
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        placeholder="Enter some text for the agent to learn from."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={() => onTrain(text)}>
        Train from Text
      </Button>
      <Typography>{learnStatus}</Typography>
    </>
  );
}
