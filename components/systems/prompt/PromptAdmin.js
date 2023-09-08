import { useState, useEffect } from "react";
import useSWR from "swr";
import { useRouter } from "next/router";
import { mutate } from "swr";
import { sdk } from "../../../lib/apiClient";
import {
  TextField,
  Button,
  Divider,
  Container,
  Select,
  MenuItem,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputLabel,
  FormControl,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
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
  const [openDialog, setOpenDialog] = useState(false);
  const [newPromptName, setNewPromptName] = useState("");
  console.log('PromptAdmin prompt: ', prompt);
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
  const handleCreate = async () => {
    await sdk.addPrompt(newPromptName, newBody, promptCategory);
    mutate("prompt");
    router.push(`/prompt/${promptName}`);
  };
  const handleNewCategory = async () => {
    // Need to add this endpoint to SDK
    //await sdk.addPromptCategory(newPromptName);
    mutate("promptCategories");
    router.push(`/prompt`);
  };

  return (
    <Container>
      <Button onClick={() => setOpenDialog(true)} color="info">
        <AddIcon /> New Prompt
      </Button>
      <Button color="info">
        <AddIcon /> New Prompt Category
      </Button>
      <Button onClick={handleDelete} color="error">
        <DeleteIcon /> Delete Prompt
      </Button>
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
            {promptCategories.data &&
              Object.values(promptCategories.data).map((category) => (
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
            {prompts.data &&
              Object.values(prompts.data).map((p) => (
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
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Create New Prompt</DialogTitle>
        <DialogContent>
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
              {promptCategories.data &&
                Object.values(promptCategories.data).map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="New Prompt Name"
            type="text"
            fullWidth
            value={newPromptName}
            onChange={(e) => setNewPromptName(e.target.value)}
            variant="outlined"
            color="info"
          />
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={() => setOpenDialog(false)}>
            Cancel
          </Button>
          <Button color="info" onClick={handleCreate}>
            Create Prompt
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
