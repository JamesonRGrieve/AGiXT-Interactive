import React, { useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/router";
import { sdk } from "../../../../lib/apiClient";
import {
  Button,
  TextField,
  Typography,
  Divider,
  Input,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import PublishIcon from "@mui/icons-material/Publish";

export default function MemoryManagement({
  collectionNumber = 0,
  limit = 10,
  minRelevanceScore = 0.0,
}) {
  const router = useRouter();
  const agentName = useMemo(() => router.query.agent, [router.query.agent]);
  const [memoryQuery, setMemoryQuery] = useState("");
  const [response, setResponse] = useState([]);

  const queryMemory = async () => {
    if (memoryQuery) {
      const res = await sdk.getAgentMemories(
        agentName,
        memoryQuery,
        limit,
        minRelevanceScore,
        collectionNumber
      );
      setResponse(res);
    }
  };

  const [openImportDialog, setOpenImportDialog] = useState(false);

  const handleImportMemories = async (event) => {
    const files = Array.from(event.target.files);
    for (let file of files) {
      const fileContent = await file.text();
      await sdk.importAgentMemories(agentName, fileContent);
      await queryMemory();
    }
    setOpenImportDialog(false);
  };

  const deleteMemory = async (memoryId) => {
    await sdk.deleteAgentMemory(agentName, memoryId, collectionNumber);
    await queryMemory();
  };

  const deleteMemories = async () => {
    await sdk.wipeAgentMemories(agentName, collectionNumber);
    await queryMemory();
  };
  const handleExportMemories = async () => {
    const memories = await sdk.exportAgentMemories(agentName);
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(memories)], {
      type: "application/json",
    });
    element.href = URL.createObjectURL(file);
    element.download = `${agentName}-Memories.json`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  return (
    <>
      <Typography variant="h6" sx={{ my: "1rem" }}>
        <Button onClick={handleExportMemories} color={"info"}>
          <FileDownloadOutlinedIcon color={"info"} /> Export Agent Memories
        </Button>
        &nbsp;&nbsp;
        <Button onClick={() => setOpenImportDialog(true)} color={"info"}>
          <PublishIcon color={"info"} /> Import Agent Memories
        </Button>
      </Typography>

      <Dialog
        open={openImportDialog}
        onClose={() => setOpenImportDialog(false)}
      >
        <DialogTitle>Import Agent Memories</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can import agent memories from a JSON file here. This will add
            to any existing memories the agent has.
          </DialogContentText>
          <Input
            type="file"
            variant="contained"
            label="Import Agent Memories"
            color="info"
            onClick={handleImportMemories}
          >
            Import Agent Memories
          </Input>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenImportDialog(false)} color="error">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Typography component="h1" gutterBottom>
        <ReactMarkdown>
          The `Search Query` is essentially what you would type to the AI when
          you're talking to it, this will show you what results would be
          injected in context for anything you say to the AI based on its memory
          collection. This will find similar results to anything you type with
          relevance score from memory. You can choose to delete memories from
          the memory collection here.
        </ReactMarkdown>
      </Typography>
      <div className="query-section">
        <TextField
          value={memoryQuery}
          onChange={(e) => setMemoryQuery(e.target.value)}
          label="Search Query"
          variant="outlined"
          margin="normal"
          fullWidth
        />
        <Button
          variant="contained"
          color="info"
          onClick={queryMemory}
          style={{ marginTop: "10px" }}
        >
          Query Memory
        </Button>
        &nbsp;
        <Button
          variant="contained"
          color="error"
          onClick={() => deleteMemories()}
          style={{ marginTop: "10px" }}
        >
          Wipe All Memories
        </Button>
      </div>
      {Object.values(response).map((memory) => (
        <div key={memory.id}>
          <Divider style={{ margin: "20px 0" }} />
          <Typography>
            <strong>Created on:</strong> {memory.timestamp}
          </Typography>
          <Typography>
            <strong>Relevance Score:</strong> {memory.relevance_score}
          </Typography>
          <Typography>
            <strong>Memory ID:</strong> {memory.id}
          </Typography>
          <Typography>
            <strong>Memory Source:</strong> {memory.external_source_name}
          </Typography>
          <Typography>
            <strong>Memory:</strong>
            <br />
            {memory.text}
          </Typography>
          <Button
            variant="contained"
            color="error"
            onClick={() => deleteMemory(memory.id)}
          >
            Delete Memory
          </Button>
        </div>
      ))}
    </>
  );
}
