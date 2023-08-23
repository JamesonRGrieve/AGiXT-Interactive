import axios from "axios";
import { useState } from "react";
import { Container, TextField, Button, Typography } from "@mui/material";
import { mutate } from "swr";
import useSWR from "swr";
import DoubleSidedMenu from "../../components/menu/PopoutDrawerWrapper";
import PromptList from "../../components/systems/prompt/PromptList";
import { sdk } from "../../lib/apiClient";
export default function Home() {
  const [name, setName] = useState("");
  const [prompt, setPrompt] = useState("");
  // TODO: Add prompt category, setting to default for now
  const promptCategory = "Default";
  const handleCreate = async () => {
    await sdk.addPrompt({
      promptName: name,
      prompt: prompt,
      promptCategory: promptCategory,
    });
    mutate("prompt");
  };
  const prompts = useSWR(
    "prompt",
    async () =>
      await sdk.getPrompts({
        promptCategory: promptCategory,
      })
  );
  return (
    <DoubleSidedMenu
      title={"Add a New Prompt"}
      leftHeading={"Prompts"}
      leftSWR={prompts}
      leftMenu={PromptList}
      rightHeading={null}
      rightSWR={null}
      rightMenu={null}
    >
      <Container>
        <Typography variant="h6" component="h2" marginY={"1rem"}>
          Add a New Prompt
        </Typography>
        <form>
          <TextField
            fullWidth
            variant="outlined"
            label="Prompt Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <TextField
            fullWidth
            variant="outlined"
            label="Prompt Body"
            multiline
            rows={30}
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreate}
            sx={{ marginY: "1rem" }}
          >
            Add a New Prompt
          </Button>
        </form>
      </Container>
    </DoubleSidedMenu>
  );
}
