import { useEffect, useState } from "react";
import { useMemo } from "react";
import { useRouter } from "next/router";
import { sdk } from "../../../../lib/apiClient";
import ConversationSelector from "../../conversation/ConversationSelector";
import ConversationHistory from "../../conversation/ConversationHistory";
import PromptSelector from "../../prompt/PromptSelector";
import AdvancedOptions from "../AdvancedOptions";
import { Button, TextField } from "@mui/material";
import useSWR from "swr";
import { mutate } from "swr";

export default function AgentPrompt({ mode = "Prompt" }) {
  const [chatHistory, setChatHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [conversationName, setConversationName] = useState("Test");
  const [lastResponse, setLastResponse] = useState("");
  const [contextResults, setContextResults] = useState(5);
  const [shots, setShots] = useState(1);
  const [browseLinks, setBrowseLinks] = useState(false);
  const [websearch, setWebsearch] = useState(false);
  const [websearchDepth, setWebsearchDepth] = useState(0);
  const [enableMemory, setEnableMemory] = useState(false);
  const [
    injectMemoriesFromCollectionNumber,
    setInjectMemoriesFromCollectionNumber,
  ] = useState(0);
  const [conversationResults, setConversationResults] = useState(5);
  const [promptCategory, setPromptCategory] = useState("Default");
  const [promptName, setPromptName] = useState("Chat");
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
  const { data: promptCategories } = useSWR(
    `promptCategories/${agentName}`,
    async () => await sdk.getPromptCategories(agentName)
  );

  const { data: prompts } = useSWR(
    `prompts/${promptCategory}`,
    async () => await sdk.getPrompts(promptCategory)
  );
  const { data: promptArgs } = useSWR(
    `promptArgs/${promptName}`,
    async () => await sdk.getPromptArgs(promptName, promptCategory)
  );
  const { data: prompt } = useSWR(
    `prompt/${promptName}`,
    async () => await sdk.getPrompt(promptName, promptCategory)
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
  useEffect(() => {
    mutate(`promptCategories/${agentName}`);
    if (promptCategories) {
      setPromptCategory(promptCategory);
    }
  }, [promptCategory]);
  useEffect(() => {
    mutate(`prompts/${promptCategory}`);
    if (prompts) {
      setPromptName(promptName);
    }
    mutate(`promptArgs/${promptName}`);
    mutate(`prompt/${promptName}`);
  }, [promptName]);

  const PromptAgent = async (
    message,
    promptName = "Chat",
    promptCategory = "Default",
    contextResults = 5,
    shots = 1,
    browseLinks = false,
    websearch = false,
    websearchDepth = 0,
    enableMemory = false,
    injectMemoriesFromCollectionNumber = 0,
    conversationResults = 5
  ) => {
    const promptArguments = {
      user_input: message,
      prompt_category: promptCategory,
      conversation_name: conversationName,
      context_results: contextResults,
      shots: shots,
      browse_links: browseLinks,
      websearch: websearch,
      websearch_depth: websearchDepth,
      enable_memory: enableMemory,
      inject_memories_from_collection_number:
        injectMemoriesFromCollectionNumber,
      conversation_results: conversationResults,
      ...promptArgs,
    };
    if (mode != "Prompt") {
      promptName = mode;
    }
    const response = await sdk.promptAgent(
      agentName,
      promptName,
      promptArguments
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
    if (!message) return;
    await PromptAgent(
      message,
      promptName,
      promptCategory,
      contextResults,
      shots,
      browseLinks,
      websearch,
      websearchDepth,
      enableMemory,
      injectMemoriesFromCollectionNumber,
      conversationResults
    );
    setMessage("");
  };
  return (
    <>
      <ConversationSelector
        conversations={conversations}
        conversationName={conversationName}
        setConversationName={setConversationName}
      />
      <ConversationHistory chatHistory={chatHistory} />
      {mode == "Prompt" ? (
        <>
          <br />
          <PromptSelector
            promptCategories={promptCategories}
            promptCategory={promptCategory}
            setPromptCategory={setPromptCategory}
            promptName={promptName}
            setPromptName={setPromptName}
            prompt={prompt}
            promptArgs={promptArgs}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendMessage}
            sx={{ height: "56px" }}
          >
            Send
          </Button>
        </>
      ) : (
        <>
          <TextField
            label="User Input"
            placeholder="User input..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{ mb: 2, width: "75%" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendMessage}
            sx={{ height: "56px" }}
          >
            Send
          </Button>
        </>
      )}
      &nbsp;&nbsp;
      <AdvancedOptions
        contextResults={contextResults}
        setContextResults={setContextResults}
        shots={shots}
        setShots={setShots}
        websearchDepth={websearchDepth}
        setWebsearchDepth={setWebsearchDepth}
        injectMemoriesFromCollectionNumber={injectMemoriesFromCollectionNumber}
        setInjectMemoriesFromCollectionNumber={
          setInjectMemoriesFromCollectionNumber
        }
        conversationResults={conversationResults}
        setConversationResults={setConversationResults}
        browseLinks={browseLinks}
        setBrowseLinks={setBrowseLinks}
        websearch={websearch}
        setWebsearch={setWebsearch}
        enableMemory={enableMemory}
        setEnableMemory={setEnableMemory}
      />
    </>
  );
}
