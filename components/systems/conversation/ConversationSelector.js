import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useMemo } from "react";
import { useRouter } from "next/router";
import { sdk } from "../../../lib/apiClient";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

export default function ConversationSelector({
  conversations,
  conversationName,
  setConversationName,
  conversation,
}) {
  const router = useRouter();
  const agentName = useMemo(() => router.query.agent, [router.query.agent]);
  const [newConversationName, setNewConversationName] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const handleAddConversation = async () => {
    if (!newConversationName) return;

    await sdk.newConversation(agentName, newConversationName);
    setNewConversationName("");
    setOpenDialog(false);
    conversations = await sdk.getConversations();
    setConversationName(newConversationName);
  };

  const handleDeleteConversation = async () => {
    if (!conversationName) return;
    await sdk.deleteConversation(agentName, conversationName);
    const updatedConversations = conversations.filter(
      (c) => c !== conversationName
    );
    setConversationName(updatedConversations[0] || "");
  };

  const handleExportConversation = async () => {
    if (!conversationName) return;
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(conversation)], {
      type: "application/json",
    });
    element.href = URL.createObjectURL(file);
    element.download = `${conversationName}.json`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  const handleImportConversation = async (event) => {
    const files = Array.from(event.target.files);
    for (let file of files) {
      const fileContent = await file.text();
      const fileName = file.name.replace(".json", "");
      await sdk.newConversation(agentName, fileName);
      await sdk.importConversation(fileName, fileContent);
      conversations = await sdk.getConversations();
      setConversationName(fileName);
    }
  };

  return (
    <FormControl
      sx={{
        mb: 2,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <InputLabel id="conversation-label">Select a Conversation</InputLabel>
      <Select
        labelId="conversation-label"
        sx={{ width: "50%" }}
        label="Select a Conversation"
        value={conversationName}
        onChange={(e) => setConversationName(e.target.value)}
      >
        {conversations
          ? conversations.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))
          : null}
      </Select>
      <Button onClick={handleExportConversation}>
        <FileDownloadOutlinedIcon color={"info"} />
      </Button>
      <Button onClick={() => setOpenDialog(true)}>
        <AddIcon color={"info"} />
      </Button>
      <Button onClick={handleDeleteConversation}>
        <DeleteIcon color={"error"} />
      </Button>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Create New Conversation</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="New Conversation Name"
            type="text"
            fullWidth
            value={newConversationName}
            onChange={(e) => setNewConversationName(e.target.value)}
            variant="outlined"
            color="info"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="error">
            Cancel
          </Button>
          <Button onClick={handleAddConversation} color="info">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </FormControl>
  );
}
