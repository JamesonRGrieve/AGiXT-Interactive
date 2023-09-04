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

export default function ConversationSelector({
  conversations,
  conversationName,
  setConversationName,
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

  return (
    <FormControl
      fullWidth
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
        fullWidth
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
      <Button onClick={() => setOpenDialog(true)}>
        <AddIcon />
      </Button>
      <Button onClick={handleDeleteConversation}>
        <DeleteIcon />
      </Button>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Create New Conversation</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Conversation Name"
            type="text"
            fullWidth
            value={newConversationName}
            onChange={(e) => setNewConversationName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddConversation} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </FormControl>
  );
}
