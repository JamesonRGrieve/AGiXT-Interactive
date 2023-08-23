import { useState } from "react";
import { useRouter } from "next/router";
import { mutate } from "swr";
import { TextField, Button, Divider, Container } from "@mui/material";
import { sdk } from "../../lib/apiClient";

export default function ChainAdmin({ friendly_name, name, args, enabled }) {
  const router = useRouter();
  const chainName = router.query.chain;
  const [newName, setNewName] = useState("");
  const handleDelete = async () => {
    await sdk.deleteChain(chainName);
    mutate(`chain`);
    router.push(`/chain`);
  };
  const handleRename = async () => {
    await sdk.renameChain(chainName, newName);
    mutate(`chain`);
    router.push(`/chain/${newName}`);
  };
  const handleRun = async () => {
    // TODO: Need to add fields for userInput, agentName, allResponses, fromStep, chainArgs.  See streamlit agent interactions page in Chain mode for example of how this should be set up.
    await sdk.runChain({
      chainName: chainName,
      userInput: userInput,
      agentName: agentName,
      allResponses: allResponses,
      fromStep: fromStep,
      chainArgs: chainArgs,
    });
  };
  return (
    <Container>
      <TextField
        fullWidth
        variant="outlined"
        label="New Chain Name"
        value={newName}
        onChange={(e) => {
          setNewName(e.target.value);
        }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleRename}
        sx={{ marginY: "1rem" }}
      >
        Rename Chain
      </Button>
      <Divider sx={{ my: "1.5rem" }} />
      <Button
        onClick={handleRun}
        variant="contained"
        color="success"
        sx={{ mr: "1rem" }}
      >
        Run Chain
      </Button>
      <Button onClick={handleDelete} variant="contained" color="error">
        Delete Chain
      </Button>
    </Container>
  );
}
