import {
  Button,
  Checkbox,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

export default function GithubTraining({ onTrain }) {
  const [repo, setRepo] = useState("");

  return (
    <Container>
      <Typography variant="h5">Train from GitHub Repository</Typography>
      <Typography>
        The agent will download all files from the GitHub repository you provide
        into its long term memory.
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Enter a GitHub repository for the agent to learn from.. For example, 'Josh-XT/AGiXT'"
        value={repo}
        onChange={(e) => setRepo(e.target.value)}
      />
      <Checkbox inputProps={{ "aria-label": "Use a branch other than main" }} />
      Use a branch other than main
      <Button variant="contained" color="primary" onClick={() => onTrain(repo)}>
        Train from GitHub Repository
      </Button>
    </Container>
  );
}
