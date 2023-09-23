import { useState, useEffect } from "react";
import useSWR from "swr";
import { useRouter } from "next/router";
import { mutate } from "swr";
import { sdk } from "../../../lib/apiClient";
import {
  TextField,
  Button,
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
import { useSettings } from "../../../lib/SettingsContext";
export default function PromptAdmin({ setPrompts }) {
  const router = useRouter();
  const [promptCategory, setPromptCategory] = useState("Default");
  const [promptName, setPromptName] = useState("Chat");
  const { promptCategories, prompts } = useSettings();

  const prompt = useSWR(
    `prompt/${promptCategory}/${promptName}`,
    async () => await sdk.getPrompt(promptName, promptCategory)
  );
  useEffect(() => {
    if (promptCategories) {
      setPromptCategory(promptCategory);
    }
    mutate("prompt");
    if (prompts) {
      setPromptName(promptName);
    }
    mutate(`prompt/${promptCategory}/${promptName}`);
  }, [promptCategories, promptName, promptCategory, prompts]);

  const [newBody, setNewBody] = useState(prompt.data);
  const [openDialog, setOpenDialog] = useState(false);
  const [newPromptName, setNewPromptName] = useState("");
  const [newPromptCategoryName, setNewPromptCategoryName] = useState("");
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);

  console.log("PromptAdmin prompt: ", prompt);
  const handleDelete = async () => {
    await sdk.deletePrompt(promptName, promptCategory);
    mutate(`prompt`);
    router.push(`/prompt`);
  };
  const handleSave = async () => {
    await sdk.updatePrompt(promptName, newBody, promptCategory);
    mutate(`prompt`);
  };
  const handleCreate = async () => {
    await sdk.addPrompt(newPromptName, newBody, promptCategory);
    mutate("prompt");
    const fetchPrompts = async () => {
      const prompts = await sdk.getPrompts(promptCategory);
      setPrompts(prompts);
    };
    fetchPrompts();
  };
  const handleNewCategory = async () => {
    await sdk.addPromptCategory(newPromptCategoryName);
    mutate("promptCategories");
    router.push(`/prompt`);
  };
  useEffect(() => {
    if (prompt.data) {
      setNewBody(prompt.data);
    }
  }, [prompt.data]);
  const sortedPrompts = prompts ? Object.values(prompts).sort() : [];
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
              {promptCategories &&
                Object.values(promptCategories).map((category) => (
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
      <Dialog
        open={openCategoryDialog}
        onClose={() => setOpenCategoryDialog(false)}
      >
        <DialogTitle>Create New Prompt Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="New Prompt Category Name"
            type="text"
            fullWidth
            value={newPromptCategoryName}
            onChange={(e) => setNewPromptCategoryName(e.target.value)}
            variant="outlined"
            color="info"
          />
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={() => setOpenCategoryDialog(false)}>
            Cancel
          </Button>
          <Button color="info" onClick={handleNewCategory}>
            Create Prompt Category
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
