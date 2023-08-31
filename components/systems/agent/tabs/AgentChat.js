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
  const router = useRouter();
  const agentName = useMemo(() => router.query.agent, [router.query.agent]);
  const { data: conversations } = useSWR(
    "getConversations",
    async () => await sdk.getConversations()
  );
  // TODO: Conversation history not updating when a new conversation is selected.
  // This keeps coming back response code "422 Unprocessable Entity" but works in node notebook
  const { data: conversation } = useSWR(
    `conversation/${agentName}/${conversationName}`,
    async () => await sdk.getConversation(agentName, conversationName, 100, 1)
  );

  /* Here is an example of it working properly in the node notebook. ApiClient is sdk from the apiClient file.
import AGiXTSDK from "./index.ts";
const ApiClient = new AGiXTSDK({
  baseUri: "http://localhost:7437",
  apiKey: "",
});
const conversation = await ApiClient.getConversation(
  "New Test Agent",
  "Test",
  100,
  1
);
console.log(conversation);

// conversation should equal something like:
[
  {
    message: 'What can you tell me about AGiXT?',
    role: 'USER',
    timestamp: 'August 09, 2023 05:17 PM'
  },
  {
    message: 'AGiXT is a dynamic Artificial Intelligence Automation Platform designed to manage AI instruction and task execution across various providers. It uses adaptive memory handling and a wide range of commands to enhance AI understanding and responsiveness. AGiXT features Smart Instruct and Smart Chat, which integrate web search, planning strategies, and conversation continuity to improve task completion. It also supports multiple AI providers, code evaluation, comprehensive chain management, and platform interoperability. AGiXT aims to push the boundaries of AI and contribute to the development of Artificial General Intelligence (AGI).',
    role: 'OpenAI',
    timestamp: 'August 09, 2023 05:17 PM'
  }
]
But it is returning:
"Unable to retrieve data." and the server is giving a 422 Unprocessable Entity response code when trying to use it on the NextJS front end.
*/

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
  }, [conversationName, conversation]);
  console.log("Agent: ", agentName);
  console.log("Conversation Name: ", conversationName);
  console.log("Conversation Data: ", conversation);
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
