import { useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/router";
import { mutate } from "swr";
import { sdk } from "../../lib/apiClient";
import { TextField, Button, Divider, Container } from "@mui/material";
export default function PromptAdmin({ friendly_name, name, args, enabled }) {
  const router = useRouter();
  const promptName = router.query.prompt;
  const prompt = useSWR(
    "prompt/" + promptName,
    async () => await sdk.getPrompt(promptName)
  );
  const [newName, setNewName] = useState(prompt.data.prompt_name);
  const [newBody, setNewBody] = useState(prompt.data.prompt);
  console.log(prompt);
  const handleDelete = async () => {
    // TODO: Add prompt category field and logic to choose category before choosing prompt, setting to "Default" for now
    const promptCategory = "Default";
    await sdk.deletePrompt({ promptName: promptName, promptCategory: promptCategory })};
    mutate(`prompt`);
    router.push(`/prompt`);
  };
  const handleSave = async () => {
    // TODO: Add prompt category field and logic to choose category before choosing prompt, setting to "Default" for now
    const promptCategory = "Default";
    await sdk.updatePrompt({
      promptName: newName,
      promptCategory: promptCategory,
      prompt: newBody,
    });
    mutate(`prompt`);
    router.push(`/prompt/${newName}`);
  };
  return (
    <Container>
      <TextField
        fullWidth
        variant="outlined"
        label="New Prompt Name"
        value={newName}
        onChange={(e) => {
          setNewName(e.target.value);
        }}
      />
      <TextField
        fullWidth
        multiline
        rows={30}
        variant="outlined"
        label="New Prompt Body"
        value={newBody}
        onChange={(e) => {
          setNewBody(e.target.value);
        }}
      />
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
