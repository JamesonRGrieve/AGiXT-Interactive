import { useState } from "react";
import { useRouter } from "next/router";
import { sdk } from "../../lib/apiClient";
import { mutate } from "swr";
import { TextField, Button, Divider, Container } from "@mui/material";
export default function AgentAdmin({ friendly_name, name, args, enabled }) {
  const router = useRouter();
  const agentName = router.query.agent;
  const [newName, setNewName] = useState("");
  const handleDelete = async () => {
    await sdk.deleteAgent(agentName);
    mutate(`agent`);
    router.push(`/agent`);
  };
  const handleRename = async () => {
    await sdk.renameAgent(agentName, newName);
    mutate(`agent`);
    router.push(`/agent/${newName}`);
  };
  return (
    <Container>
      <TextField
        fullWidth
        variant="outlined"
        label="New Agent Name"
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
        Rename Agent
      </Button>
      <Divider sx={{ my: "1.5rem" }} />
      <Button onClick={handleDelete} variant="contained" color="error">
        Delete Agent
      </Button>
    </Container>
  );
}
