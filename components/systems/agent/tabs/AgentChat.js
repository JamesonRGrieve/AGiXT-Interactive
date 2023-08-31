import { useEffect, useState } from "react";
import { useMemo } from "react";
import { useRouter } from "next/router";
import { sdk } from "../../../../lib/apiClient";
import {
  Typography,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import useSWR from "swr";
import { mutate } from "swr";

export default function AgentChat() {
  const [chatHistory, setChatHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [conversationName, setConversationName] = useState("Test");
  const [lastResponse, setLastResponse] = useState("");
  const router = useRouter();
  const agentName = useMemo(() => router.query.agent, [router.query.agent]);
  const { data: conversations } = useSWR(
    "getConversations",
    async () => await sdk.getConversations()
  );

  const { data: conversation } = useSWR(
    `conversation/${agentName}/${conversationName}`,
    async () => await sdk.getConversation(agentName, conversationName, 100, 1)
  );
  useEffect(() => {
    mutate("getConversations");
    if (conversations) {
      setConversationName(conversationName);
    }
  }, [conversationName]);
  useEffect(() => {
    mutate(`conversation/${agentName}/${conversationName}`);
    if (
      conversation != "Unable to retrieve data." &&
      conversation != undefined
    ) {
      setChatHistory(conversation);
    }
  }, [conversationName, conversation, lastResponse]);

  const MessageAgent = async (message) => {
    // TODO: Add contextResults to the UI in a chat settings popup or drawer, unsure which is better.
    // The same area for chat settings will need a lot more than just contextResults.
    const contextResults = 5;

    const response = await sdk.chat(
      agentName,
      message,
      conversationName,
      contextResults
    );
    setLastResponse(response);
  };

  const handleKeyPress = async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSendMessage();
    }
  };
  const handleSendMessage = async () => {
    await MessageAgent(message);
    setMessage("");
  };
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Select a Conversation
      </Typography>
      <Select
        fullWidth
        label="Conversation"
        value={conversationName}
        onChange={(e) => setConversationName(e.target.value)}
        sx={{ mb: 2 }}
      >
        {conversations
          ? conversations.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))
          : []}
      </Select>
      <Paper
        elevation={5}
        sx={{ padding: "0.5rem", overflowY: "auto", height: "60vh" }}
      >
        {chatHistory.map((chatItem, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <Typography variant="caption">
              {chatItem.role} - {chatItem.timestamp}
            </Typography>
            <Typography variant="body1">{chatItem.message}</Typography>
          </div>
        ))}
      </Paper>

      <TextField
        fullWidth
        label="Enter Message for Agent"
        placeholder="Chat Message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSendMessage}
        fullWidth
      >
        Message Agent
      </Button>
    </>
  );
}
