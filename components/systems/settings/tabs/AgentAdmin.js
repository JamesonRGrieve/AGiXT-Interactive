import { useState } from "react";
import { useRouter } from "next/router";
import { mutate } from "swr";
import { TextField, Button, Divider, Typography } from "@mui/material";
import { sdk } from "../../../../lib/apiClient";
export default function AgentAdmin({}) {
  const router = useRouter();
  const agentName = router.query.agent;
  const [newName, setNewName] = useState("");
  const handleDelete = async () => {
    await sdk.deleteAgent(agentName);
    mutate(`agent`);
    router.push(`/`);
  };
  const handleRename = async () => {
    await sdk.renameAgent(agentName, newName);
    mutate(`agent`);
    router.push(`/agent/?agent=${newName}`);
  };
  return (
    <>
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
        color="info"
        onClick={handleRename}
        sx={{ marginY: "1rem" }}
      >
        Rename Agent
      </Button>
      <Divider sx={{ my: "1.5rem" }} />
      <Button onClick={handleDelete} variant="contained" color="error">
        Delete Agent
      </Button>
    </>
  );
}
