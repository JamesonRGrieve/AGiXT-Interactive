import {
  Select,
  MenuItem,
  TextField,
  InputLabel,
  FormControl,
  Tooltip,
  Box,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useSettings } from "../../../lib/SettingsContext";

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
  const { prompts } = useSettings();
  const sortedPrompts = [...prompts].sort();
  const skipArgs = [
    "conversation_history",
    "context",
    "COMMANDS",
    "command_list",
    "date",
    "agent_name",
    "working_directory",
    "helper_agent_name",
    "prompt_name",
    "context_results",
    "conversation_results",
    "conversation_name",
    "prompt_category",
    "websearch",
    "websearch_depth",
    "enable_memory",
    "inject_memories_from_collection_number",
    "context_results",
    "shots",
    "browse_links",
    "shot_count",
    "persona",
    "",
  ];
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
          if (!skipArgs.includes(arg)) {
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
