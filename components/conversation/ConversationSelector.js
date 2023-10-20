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
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import { useState } from "react";

export default function ConversationSelector({
  agentName,
  conversations,
  conversationName,
  setConversationName,
  setConversations,
  conversation,
  darkMode,
  handleToggleDarkMode,
  MenuDarkSwitch,
  handleLogout,
  sdk,
}) {
  const [openNewConversation, setOpenNewConversation] = useState(false);
  const [newConversationName, setNewConversationName] = useState("");
  // Make a confirmation dialog for deleting conversations
  const [openDeleteConversation, setOpenDeleteConversation] = useState(false);

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
    setOpenDeleteConversation(false);
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
      &nbsp;&nbsp;&nbsp;
      <Tooltip title="Select a Conversation">
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
        </FormControl>
      </Tooltip>
      &nbsp;
      <Tooltip title="Add Conversation">
        <Button
          onClick={() => setOpenNewConversation(true)}
          color={"info"}
          sx={{ minWidth: "20px" }}
        >
          <AddIcon sx={{ minWidth: "20px" }} color={"info"} />
        </Button>
      </Tooltip>
      <Tooltip title="Export Conversation">
        <Button
          onClick={handleExportConversation}
          color={"info"}
          sx={{ minWidth: "20px" }}
        >
          <FileDownloadOutlinedIcon sx={{ minWidth: "20px" }} color={"info"} />
        </Button>
      </Tooltip>
      <Tooltip title="Delete Conversation">
        <Button
          onClick={() => setOpenDeleteConversation(true)}
          color={"error"}
          sx={{ minWidth: "20px" }}
        >
          <DeleteIcon sx={{ minWidth: "20px" }} color={"error"} />
        </Button>
      </Tooltip>
      <Tooltip
        title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        <MenuDarkSwitch checked={darkMode} onChange={handleToggleDarkMode} />
      </Tooltip>
      <Tooltip title="Logout">
        <Button
          onClick={handleLogout}
          color={"error"}
          sx={{ minWidth: "20px" }}
        >
          <LogoutIcon sx={{ minWidth: "20px" }} color={"error"} />
        </Button>
      </Tooltip>
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
      <Dialog
        open={openDeleteConversation}
        onClose={() => setOpenDeleteConversation(false)}
      >
        <DialogTitle>Delete Conversation</DialogTitle>
        <DialogContent>
          <DialogContent>
            Are you sure you want to delete this conversation?
          </DialogContent>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDeleteConversation(false)}
            color="error"
          >
            Cancel
          </Button>
          <Button onClick={handleDeleteConversation} color="info">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
