import { useState } from "react";
import { useRouter } from "next/router";
import { mutate } from "swr";
import { TextField, Button, Divider, Box, Typography } from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { sdk } from "../../../../lib/apiClient";

export default function ChainAdmin({ steps }) {
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
  const handleExportChain = async () => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(steps.data)], {
      type: "application/json",
    });
    element.href = URL.createObjectURL(file);
    element.download = `${chainName}.json`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };
  return (
    <Box sx={{ margin: "1rem" }}>
      <Button onClick={handleExportChain} color={"info"}>
        <FileDownloadOutlinedIcon color={"info"} /> Export Chain
      </Button>
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
        color="info"
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
