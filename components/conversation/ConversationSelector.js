import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Typography,
  Input,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useMemo } from "react";
import { useRouter } from "next/router";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";

export default function ConversationSelector({
  conversations,
  conversationName,
  setConversationName,
  setConversations,
  conversation,
  darkMode,
  handleToggleDarkMode,
  MenuDarkSwitch,
  sdk,
}) {
  const router = useRouter();
  const agentName = useMemo(() => router.query.agent, [router.query.agent]);
  const [openNewConversation, setOpenNewConversation] = useState(false);
  const [newConversationName, setNewConversationName] = useState("");
  const handleAddConversation = async () => {
    if (!newConversationName) return;
    await sdk.newConversation(agentName, newConversationName);
    setNewConversationName("");
    setOpenNewConversation(false);
    const fetchConversations = async () => {
      const updatedConversations = await sdk.getConversations();
      setConversations(updatedConversations);
    };
    fetchConversations();
    setConversationName(newConversationName);
  };
  const handleDeleteConversation = async () => {
    if (!conversationName) return;
    await sdk.deleteConversation(agentName, conversationName);
    const updatedConversations = conversations.filter(
      (c) => c !== conversationName
    );
    setConversations(updatedConversations);
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

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
      }}
    >
      <FormControl
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
        fullWidth
      >
        <InputLabel id="conversation-label">Select a Conversation</InputLabel>
        <Select
          fullWidth
          labelId="conversation-label"
          label="Select a Conversation"
          sx={{
            height: "30px",
          }}
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
        &nbsp;
        <Button
          onClick={() => setOpenNewConversation(true)}
          color={"info"}
          sx={{ minWidth: "30px" }}
        >
          <AddIcon sx={{ minWidth: "30px" }} color={"info"} />
        </Button>
        <Button
          onClick={handleExportConversation}
          color={"info"}
          sx={{ minWidth: "30px" }}
        >
          <FileDownloadOutlinedIcon sx={{ minWidth: "30px" }} color={"info"} />
        </Button>
        <Button
          onClick={handleDeleteConversation}
          color={"error"}
          sx={{ minWidth: "30px" }}
        >
          <DeleteIcon sx={{ minWidth: "30px" }} color={"error"} />
        </Button>
      </FormControl>
      <MenuDarkSwitch checked={darkMode} onChange={handleToggleDarkMode} />
      <Dialog
        open={openNewConversation}
        onClose={() => setOpenNewConversation(false)}
      >
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
          <Button onClick={() => setOpenNewConversation(false)} color="error">
            Cancel
          </Button>
          <Button onClick={handleAddConversation} color="info">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
