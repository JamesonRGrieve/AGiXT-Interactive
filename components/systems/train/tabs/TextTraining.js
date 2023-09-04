import { Button, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";

export default function TextTraining({ onTrain }) {
  const [text, setText] = useState("");

  return (
    <Container>
      <Typography variant="h5">Train from Text</Typography>
      <Typography>
        The agent will read the text you provide into its long term memory.
      </Typography>
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
    </Container>
  );
}
