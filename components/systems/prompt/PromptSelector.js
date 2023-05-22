import { useState, useEffect } from "react";
import {
  Select,
  MenuItem,
  TextField,
  InputLabel,
  FormControl,
  Typography,
  Tooltip,
  Box,
} from "@mui/material";
import { sdk } from "../../../lib/apiClient";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

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
      <Box display="flex" alignItems="center" gap={2}>
        <FormControl fullWidth sx={{ mb: 2, width: "20%" }}>
          <InputLabel id="prompt-category-label">
            Select a Prompt Category
          </InputLabel>
          <Select
            labelId="prompt-category-label"
            value={promptCategory}
            onChange={(e) => setPromptCategory(e.target.value)}
          >
            {promptCategories
              ? promptCategories.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))
              : []}
          </Select>
        </FormControl>

        <FormControl sx={{ mb: 2, width: "30%" }}>
          <InputLabel id="prompt-label">Select a Prompt</InputLabel>
          <Select
            labelId="prompt-label"
            value={promptName}
            onChange={(e) => setPromptName(e.target.value)}
          >
            {prompts.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Tooltip title={prompt} placement="right">
          <InfoOutlinedIcon style={{ cursor: "pointer", color: "green" }} />
        </Tooltip>
      </Box>

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
                label={arg}
                value={promptArgs[arg]}
                sx={{ mb: 2, width: "30%" }}
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
