import {
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/router";
import { sdk } from "../../../../lib/apiClient";

export default function GithubTraining({ collectionNumber = 0 }) {
  const [repo, setRepo] = useState("");
  const [githubUser, setGithubUser] = useState("");
  const [githubToken, setGithubToken] = useState("");
  const [githubBranch, setGithubBranch] = useState("main");
  const [useBranch, setUseBranch] = useState(false);
  const [isPrivateRepo, setIsPrivateRepo] = useState(false);
  const [useAgentSettings, setUseAgentSettings] = useState(true);
  const [learnStatus, setLearnStatus] = useState("");
  const router = useRouter();
  const agentName = router.query.agent;

  const onTrain = async () => {
    setLearnStatus("Training from GitHub repo... Please wait.");
    await sdk.learnGithubRepo(
      agentName,
      repo,
      githubUser,
      githubToken,
      githubBranch,
      collectionNumber
    );
    setLearnStatus(
      `${agentName} has finished learning from the GitHub repo: ${repo}.`
    );
    setRepo("");
  };

  return (
    <>
      <Typography>
        The agent will download all files from the GitHub repository you provide
        into its long term memory.
      </Typography>
      <br />
      <TextField
        fullWidth
        variant="outlined"
        label="Enter a GitHub repository for the agent to learn from.. For example, 'Josh-XT/AGiXT'"
        value={repo}
        onChange={(e) => setRepo(e.target.value)}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={useBranch}
            onChange={(e) => setUseBranch(e.target.checked)}
          />
        }
        label="Use a branch other than `main`"
      />
      {useBranch && (
        <>
          <TextField
            fullWidth
            variant="outlined"
            label="Enter the branch name"
            value={githubBranch}
            onChange={(e) => setGithubBranch(e.target.value)}
          />
          <br /> <br />
        </>
      )}
      <FormControlLabel
        control={
          <Checkbox
            checked={isPrivateRepo}
            onChange={(e) => setIsPrivateRepo(e.target.checked)}
          />
        }
        label="Private repository"
      />
      {isPrivateRepo && (
        <>
          <FormControlLabel
            control={
              <Checkbox
                checked={useAgentSettings}
                onChange={(e) => setUseAgentSettings(e.target.checked)}
              />
            }
            label="Use agent settings for GitHub credentials"
          />
          {!useAgentSettings && (
            <>
              <TextField
                fullWidth
                variant="outlined"
                label="Enter your GitHub username"
                value={githubUser}
                onChange={(e) => setGithubUser(e.target.value)}
              />
              <br /> <br />
              <TextField
                fullWidth
                variant="outlined"
                label="Enter your GitHub token"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
              />
              <br /> <br />
            </>
          )}
        </>
      )}
      <br /> <br />
      <Button variant="contained" color="primary" onClick={onTrain}>
        Train from GitHub Repository
      </Button>
      <br /> <br />
      <Typography>{learnStatus}</Typography>
    </>
  );
}
