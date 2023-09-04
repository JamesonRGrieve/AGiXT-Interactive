import { Button, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";

export default function WebTraining({ onTrain }) {
  const [url, setUrl] = useState("");

  return (
    <Container>
      <Typography variant="h5">Train from Websites</Typography>
      <Typography>
        The agent will scrape data from the websites you provide into its long
        term memory.
      </Typography>
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
    </Container>
  );
}
