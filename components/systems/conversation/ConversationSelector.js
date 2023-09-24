import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useMemo } from "react";
import { useRouter } from "next/router";
import { sdk } from "../../../lib/apiClient";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

export default function ConversationSelector({
  conversations,
  conversationName,
  setConversationName,
  setConversations,
  conversation,
}) {
  const router = useRouter();
  const agentName = useMemo(() => router.query.agent, [router.query.agent]);

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
        labelId="conversation-label"
        fullWidth
        label="Select a Conversation"
        sx={{ height: "30px" }}
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
        onClick={handleExportConversation}
        color={"info"}
        sx={{ minWidth: "30px" }}
      >
        <FileDownloadOutlinedIcon sx={{ maxWidth: "30px" }} color={"info"} />
      </Button>
      <Button
        onClick={handleDeleteConversation}
        color={"error"}
        sx={{ minWidth: "30px" }}
      >
        <DeleteIcon sx={{ minWidth: "30px" }} color={"error"} />
      </Button>
    </FormControl>
  );
}
