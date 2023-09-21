import { useState, useEffect, use } from "react";
import {
  Select,
  MenuItem,
  TextField,
  InputLabel,
  FormControl,
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
  setPromptArgs,
  isLoading,
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
  const sortedPrompts = [...prompts].sort();

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
            disabled={isLoading}
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
            disabled={isLoading}
          >
            {sortedPrompts.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {prompt ? (
          <Tooltip title={prompt} placement="right">
            <InfoOutlinedIcon style={{ cursor: "pointer", color: "green" }} />
          </Tooltip>
        ) : (
          <></>
        )}
      </Box>

      {promptArgs ? (
        Object.keys(promptArgs).map((arg) => {
          if (
            arg !== "conversation_history" &&
            arg !== "context" &&
            arg !== "COMMANDS" &&
            arg !== "command_list" &&
            arg !== "date" &&
            arg !== "agent_name" &&
            arg !== "working_directory" &&
            arg !== "helper_agent_name" &&
            arg !== "prompt_name" &&
            arg !== "context_results" &&
            arg !== "conversation_results" &&
            arg !== "conversation_name" &&
            arg !== "prompt_category" &&
            arg !== ""
          ) {
            return (
              <TextField
                label={arg}
                value={promptArgs[arg]}
                onChange={(e) =>
                  setPromptArgs({ ...promptArgs, [arg]: e.target.value })
                }
                sx={{ mb: 2, width: "30%" }}
                disabled={isLoading}
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
