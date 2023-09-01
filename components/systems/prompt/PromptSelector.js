import { useState, useEffect } from "react";
import { Select, MenuItem, Typography, TextField } from "@mui/material";
import { sdk } from "../../../lib/apiClient";
export default function PromptSelector({
  promptCategories,
  promptCategory,
  setPromptCategory,
  promptName,
  setPromptName,
  prompt,
  promptArgs,
}) {
  const [prompts, setPrompts] = useState([]);
  useEffect(() => {
    // Fetch prompts for category
    const fetchPrompts = async () => {
      const prompts = await sdk.getPrompts(promptCategory);
      setPrompts(prompts);
    };
    fetchPrompts();
  }, [promptCategory]);

  return (
    <>
      <Typography gutterBottom>Select a Prompt Category</Typography>

      <Select
        fullWidth
        label="Prompt Category"
        value={promptCategory}
        onChange={(e) => setPromptCategory(e.target.value)}
        sx={{ mb: 2 }}
      >
        {promptCategories
          ? promptCategories.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))
          : []}
      </Select>

      <Typography gutterBottom>Select a Prompt</Typography>

      <Select
        fullWidth
        label="Prompt"
        value={promptName}
        onChange={(e) => setPromptName(e.target.value)}
        sx={{ mb: 2 }}
      >
        {prompts.map((c) => (
          <MenuItem key={c} value={c}>
            {c}
          </MenuItem>
        ))}
      </Select>
      <Typography gutterBottom>{prompt}</Typography>

      {promptArgs ? (
        Object.values(promptArgs).map((arg) => {
          if (
            arg !== "conversation_history" &&
            arg !== "context" &&
            arg !== "COMMANDS" &&
            arg !== "command_list" &&
            arg !== "date" &&
            arg !== "agent_name" &&
            arg !== "working_directory" &&
            arg !== "helper_agent_name"
          ) {
            return (
              <TextField
                fullWidth
                label={arg}
                value={promptArgs[arg]}
                sx={{ mb: 2 }}
              />
            );
          }
        })
      ) : (
        <></>
      )}
    </>
  );
}
