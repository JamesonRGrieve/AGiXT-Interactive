import { useState } from "react";
import { useRouter } from "next/router";
import { mutate } from "swr";
import { TextField, Button, Divider, Box, Typography } from "@mui/material";
import { sdk } from "../../../../lib/apiClient";

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
  return (
    <Box sx={{ margin: "1rem" }}>
      <Typography variant="h6" component="h2" marginY={"0.5rem"}>
        Rename Chain
      </Typography>
      <TextField
        variant="outlined"
        label="New Chain Name"
        value={newName}
        onChange={(e) => {
          setNewName(e.target.value);
        }}
        sx={{ height: "56px" }}
      />
      &nbsp;&nbsp;
      <Button
        variant="contained"
        color="primary"
        onClick={handleRename}
        sx={{ height: "56px" }}
      >
        Rename Chain
      </Button>
      <Divider sx={{ marginY: "1rem" }} />
      <Button onClick={handleDelete} variant="contained" color="error">
        Delete Chain
      </Button>
    </Box>
  );
}
