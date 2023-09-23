import { useState, useEffect } from "react";
import useSWR from "swr";
import { useRouter } from "next/router";
import { mutate } from "swr";
import { sdk } from "../../../lib/apiClient";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  Typography,
  Box,
  InputLabel,
  FormControl,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { useSettings } from "../../../lib/SettingsContext";

export default function PromptAdmin() {
  const router = useRouter();
  const agentName = router.query.agent;
  const promptName = router.query.prompt || "Chat";
  const promptCategory = router.query.promptCategory || "Default";
  const { promptCategories, prompts } = useSettings();
  const setPromptCategory = (category) => {
    router.push(
      `/prompt/?agent=${agentName}&promptCategory=${category}&prompt=${promptName}`
    );
  };
  const setPromptName = (name) => {
    router.push(
      `/prompt/?agent=${agentName}&promptCategory=${promptCategory}&prompt=${name}`
    );
  };
  const prompt = useSWR(
    `prompt/${promptCategory}/${promptName}`,
    async () => await sdk.getPrompt(promptName, promptCategory)
  );
  useEffect(() => {
    if (promptCategories) {
      setPromptCategory(promptCategory);
    }
    mutate(`prompt/${promptCategory}/${promptName}`);
  }, [promptCategories, promptName, promptCategory, prompts]);

  const [newBody, setNewBody] = useState(prompt.data);
  const handleDelete = async () => {
    await sdk.deletePrompt(promptName, promptCategory);
    mutate(`prompt`);
    router.push(`/prompt`);
  };
  const handleSave = async () => {
    await sdk.updatePrompt(promptName, newBody, promptCategory);
    mutate(`prompt`);
  };

  useEffect(() => {
    if (prompt.data) {
      setNewBody(prompt.data);
    }
  }, [prompt.data]);

  const handleExportPrompt = async () => {
    // Export to a txt file with the prompt name as the file name .txt
    const element = document.createElement("a");
    const file = new Blob([newBody], {
      type: "text/plain",
    });

    element.href = URL.createObjectURL(file);
    element.download = `${promptName}.txt`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  const sortedPrompts = prompts ? Object.values(prompts).sort() : [];
  return (
    <>
      <br />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <FormControl fullWidth>
          <InputLabel id="prompt-category-label">
            Select a Prompt Category
          </InputLabel>
          <Select
            labelId="promptCategory"
            id="promptCategory"
            value={promptCategory}
            onChange={(e) => setPromptCategory(e.target.value)}
          >
            {promptCategories &&
              Object.values(promptCategories).map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="prompt-label">Select a Prompt</InputLabel>
          <Select
            labelId="promptName"
            id="promptName"
            value={promptName}
            onChange={(e) => setPromptName(e.target.value)}
          >
            {sortedPrompts.map((p) => (
              <MenuItem key={p} value={p}>
                {p}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography variant="h6">Prompt Content</Typography>
        <TextField
          id="promptContent"
          multiline
          rows={20}
          value={newBody}
          onChange={(e) => setNewBody(e.target.value)}
        />
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        sx={{ marginY: "1rem" }}
      >
        Save Prompt
      </Button>
      &nbsp;&nbsp;
      <Button color="info" onClick={handleExportPrompt}>
        <FileDownloadOutlinedIcon color="info" /> Export Prompt
      </Button>
      &nbsp;&nbsp;
      <Button onClick={handleDelete} color="error">
        <DeleteIcon /> Delete Prompt
      </Button>
    </>
  );
}
