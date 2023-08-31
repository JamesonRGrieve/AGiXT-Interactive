import { useState, useEffect } from "react";
import useSWR from "swr";
import { useRouter } from "next/router";
import { mutate } from "swr";
import { sdk } from "../../../../lib/apiClient";
import {
  TextField,
  Button,
  Divider,
  Container,
  Select,
  MenuItem,
  Typography,
  Box,
} from "@mui/material";

export default function PromptAdmin() {
  const router = useRouter();
  const [promptCategory, setPromptCategory] = useState("Default");
  const [promptName, setPromptName] = useState("Chat");

  const promptCategories = useSWR(
    "promptCategories",
    async () => await sdk.getPromptCategories()
  );
  const prompt = useSWR(
    `prompt/${promptCategory}/${promptName}`,
    async () => await sdk.getPrompt(promptName, promptCategory)
  );
  const prompts = useSWR(
    "prompt",
    async () => await sdk.getPrompts(promptCategory)
  );
  useEffect(() => {
    if (promptCategories.data) {
      setPromptCategory(promptCategory);
    }
    mutate("prompt");
    if (prompts.data) {
      setPromptName(promptName);
    }
    mutate(`prompt/${promptCategory}/${promptName}`);
  }, [promptCategories.data, promptName, promptCategory, prompts.data]);

  const [newName, setNewName] = useState(promptName);
  const [newBody, setNewBody] = useState(prompt.data);
  console.log(prompt);
  const handleDelete = async () => {
    await sdk.deletePrompt(promptName, promptCategory);
    mutate(`prompt`);
    router.push(`/prompt`);
  };
  const handleSave = async () => {
    await sdk.updatePrompt(newName, promptCategory, newBody);
    mutate(`prompt`);
    router.push(`/prompt/${newName}`);
  };

  return (
    <Container>
      <Typography variant="h6">Prompt Category/Model</Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Select
          labelId="promptCategory"
          id="promptCategory"
          value={promptCategory}
          onChange={(e) => setPromptCategory(e.target.value)}
        >
          {promptCategories.data &&
            Object.values(promptCategories.data).map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
        </Select>
        <Divider />
        <Typography variant="h6">Prompt Name</Typography>
        <Select
          labelId="promptName"
          id="promptName"
          value={promptName}
          onChange={(e) => setPromptName(e.target.value)}
        >
          {prompts.data &&
            Object.values(prompts.data).map((p) => (
              <MenuItem key={p} value={p}>
                {p}
              </MenuItem>
            ))}
        </Select>
        <Divider />
        <Typography variant="h6">Prompt Content</Typography>
        <TextField
          id="promptContent"
          multiline
          rows={20}
          defaultValue={prompt.data}
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
      <Divider sx={{ my: "1.5rem" }} />
      <Button onClick={handleDelete} variant="contained" color="error">
        Delete Prompt
      </Button>
    </Container>
  );
}
