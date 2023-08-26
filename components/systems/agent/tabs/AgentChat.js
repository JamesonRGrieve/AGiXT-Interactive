import { useState } from "react";
import { useMemo } from "react";
import { useRouter } from "next/router";
import { sdk } from "../../../../lib/apiClient";
import { Typography, Paper, TextField, Button } from "@mui/material";
export default function AgentChat() {
  const [chatHistory, setChatHistory] = useState([]);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const agentName = useMemo(() => router.query.agent, [router.query.agent]);
  const MessageAgent = async (message) => {
    // TODO: Add contextResults and conversationName
    const contextResults = 5;
    const conversationName = "default";
    const response = await sdk.chat(
      agentName,
      message,
      conversationName,
      contextResults
    );
    setChatHistory((old) => [...old, `You: ${message}`, `Agent: ${response}`]);
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
      <Typography variant="h6" gutterBottom>
        Agent Chat
      </Typography>
      <Paper
        elevation={5}
        sx={{ padding: "0.5rem", overflowY: "auto", height: "60vh" }}
      >
        {chatHistory.map((message, index) => (
          <pre key={index} style={{ margin: 0, whiteSpace: "pre-wrap" }}>
            {message}
          </pre>
        ))}
      </Paper>
    </>
  );
}
