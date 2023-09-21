import { useEffect, useState } from "react";
import { useMemo } from "react";
import { useRouter } from "next/router";
import { sdk } from "../../../../lib/apiClient";
import ConversationSelector from "../../conversation/ConversationSelector";
import ConversationHistory from "../../conversation/ConversationHistory";
import PromptSelector from "../../prompt/PromptSelector";
import ChainSelector from "../../chain/ChainSelector";
import AudioRecorder from "../../command/AudioRecorder";
import { Button, TextField, InputAdornment, Box } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import useSWR from "swr";
import { mutate } from "swr";

export default function AgentPrompt({
  chains,
  selectedChain,
  setSelectedChain,
  chainArgs,
  mode = "Prompt",
  contextResults = 5,
  shots = 1,
  browseLinks = false,
  websearch = false,
  websearchDepth = 0,
  enableMemory = false,
  injectMemoriesFromCollectionNumber = 0,
  conversationResults = 5,
  singleStep = false,
  fromStep = 0,
  allResponses = false,
  useSelectedAgent = true,
  conversationName,
  setConversationName,
}) {
  const [chatHistory, setChatHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [lastResponse, setLastResponse] = useState("");
  const [promptCategory, setPromptCategory] = useState("Default");
  const [promptName, setPromptName] = useState("Chat");
  const [isLoading, setIsLoading] = useState(false);

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
    `promptCategories`,
    async () => await sdk.getPromptCategories()
  );

  const { data: prompts } = useSWR(
    `prompts/${promptCategory}`,
    async () => await sdk.getPrompts(promptCategory)
  );
  const [promptArgs, setPromptArgs] = useState({});

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
    mutate(`promptCategories`);
    if (promptCategories) {
      setPromptCategory(promptCategory);
    }
  }, [promptCategory]);
  useEffect(() => {
    mutate(`prompts/${promptCategory}`);
    if (prompts) {
      setPromptName(promptName);
    }
    mutate(`prompt/${promptName}`);
  }, [promptName]);
  useEffect(() => {
    const getArgs = async (promptName, promptCategory) => {
      const promptArgData = await sdk.getPromptArgs(promptName, promptCategory);
      if (promptArgData) {
        let newArgs = {};
        for (const arg of promptArgData) {
          if (arg !== "") {
            newArgs[arg] = "";
          }
        }
        setPromptArgs(newArgs);
      }
    };
    getArgs(promptName, promptCategory);
  }, [promptName]);
  const runChain = async () => {
    setIsLoading(true);
    const agentOverride = useSelectedAgent ? agentName : "";
    chainArgs["conversation_name"] = conversationName;
    if (singleStep) {
      const response = await sdk.runChainStep(
        selectedChain,
        fromStep,
        message,
        agentOverride,
        chainArgs
      );
      setIsLoading(false);
      setLastResponse(response);
    } else {
      const response = await sdk.runChain(
        selectedChain,
        message,
        agentOverride,
        allResponses,
        fromStep,
        chainArgs
      );
      setIsLoading(false);
      setLastResponse(response);
    }
  };
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
    setIsLoading(true);
    if (message) {
      promptArgs["user_input"] = message;
    }
    const disableMemory = !enableMemory;
    const promptArguments = {
      prompt_category: promptCategory,
      conversation_name: conversationName,
      context_results: contextResults,
      shots: shots,
      browse_links: browseLinks,
      websearch: websearch,
      websearch_depth: websearchDepth,
      disable_memory: disableMemory,
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
    setIsLoading(false);
    setLastResponse(response);
  };

  const handleKeyPress = async (event) => {
    if (event.key === "Enter" && !event.shiftKey && message) {
      event.preventDefault();
      handleSendMessage();
    }
  };
  const handleSendMessage = async () => {
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
        conversation={conversation}
      />
      <ConversationHistory chatHistory={chatHistory} isLoading={isLoading} />
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
            setPromptArgs={setPromptArgs}
            disabled={isLoading}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendMessage}
            disabled={isLoading}
            sx={{ height: "56px" }}
          >
            Send
          </Button>
        </>
      ) : mode == "Chain" ? (
        <>
          <ChainSelector
            chains={chains}
            sdk={sdk}
            selectedChain={selectedChain}
            setSelectedChain={setSelectedChain}
            disabled={isLoading}
          />
          <TextField
            label="User Input"
            placeholder="User input..."
            multiline
            rows={2}
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{ mb: 2 }}
            disabled={isLoading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={runChain}
                    disabled={isLoading}
                    sx={{ height: "56px", padding: "0px" }}
                  >
                    <SendIcon />
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        </>
      ) : (
        <>
          <TextField
            label="User Input"
            placeholder="User input..."
            multiline
            rows={2}
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{ mb: 2 }}
            disabled={isLoading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSendMessage}
                    disabled={isLoading}
                    sx={{ height: "56px", padding: "0px" }}
                  >
                    <SendIcon />
                  </Button>
                  <AudioRecorder
                    setUserInput={setMessage}
                    handleSendMessage={handleSendMessage}
                  />
                </InputAdornment>
              ),
            }}
          />
        </>
      )}
    </>
  );
}
