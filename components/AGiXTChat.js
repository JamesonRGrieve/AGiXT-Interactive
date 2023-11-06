import { useEffect, useState } from "react";
import ConversationHistory from "./conversation/ConversationHistory";
import ConversationSelector from "./conversation/ConversationSelector";
import AudioRecorder from "./conversation/AudioRecorder";
import NoteAddOutlinedIcon from "@mui/icons-material/NoteAddOutlined";
import { setCookie, getCookie } from "cookies-next";
import AGiXTSDK from "agixt";
import Tooltip from "@mui/material/Tooltip";
import Router from "next/router";

import {
  Button,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

export default function AGiXTChat({
  selectedChain,
  chainArgs = {},
  enableFileUpload = false,
  contextResults = 5,
  shots = 1,
  browseLinks = false,
  websearch = false,
  websearchDepth = 0,
  enableMemory = false,
  injectMemoriesFromCollectionNumber = 0,
  conversationResults = 5,
  fromStep = 0,
  allResponses = false,
  useSelectedAgent = true,
  conversationName = "Test",
  mode = "prompt",
  promptName = "Chat",
  promptCategory = "Default",
  agentName = "gpt4free",
  insightAgent = "",
  baseUri = "http://localhost:7437",
  topMargin = "-35",
  setConversationName,
  showConversationBar = false,
  apiKeyCookie = "apiKey",
}) {
  const apiKey = getCookie(apiKeyCookie) || "";
  const sdk = new AGiXTSDK({
    baseUri: baseUri,
    apiKey: apiKey,
  });

  if (insightAgent === "") {
    insightAgent = agentName;
  }
  const [chatHistory, setChatHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [lastResponse, setLastResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [openFileUpload, setOpenFileUpload] = useState(false);
  const [promptArgs, setPromptArgs] = useState({});
  const [conversations, setConversations] = useState([]);
  const [hasFiles, setHasFiles] = useState(false); // Will add logic later
  const handleCloseFileUpload = () => {
    setOpenFileUpload(false);
  };
  const handleUploadFiles = async () => {
    let newUploadedFiles = [];
    // Format for uploadedFiles should be [{"file_name": "file_content"}]
    // Iterate through the files and add them to the form data
    for (const file of uploadedFiles) {
      const fileContent = await file.text();
      newUploadedFiles.push({ [file.name]: fileContent });
    }
    setUploadedFiles(newUploadedFiles);
    setOpenFileUpload(false);
  };

  useEffect(() => {
    const fetchConversations = async () => {
      const convos = await sdk.getConversations(agentName);
      setConversations(convos);
    };
    fetchConversations();
  }, [agentName]);

  useEffect(() => {
    const fetchConversation = async () => {
      const convo = await sdk.getConversation(
        agentName,
        conversationName,
        100,
        1
      );
      setChatHistory(convo);
    };
    fetchConversation();
  }, [conversationName, lastResponse]);

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
  // Uploaded files will be formatted like [{"file_name": "file_content"}]
  useEffect(() => {
    setCookie("conversationName", conversationName);
  }, [conversationName]);
  const runChain = async () => {
    setIsLoading(true);
    const agentOverride = useSelectedAgent ? agentName : "";
    chainArgs["conversation_name"] = conversationName;
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
  };
  const PromptAgent = async (
    message,
    promptName = "Chat with Commands",
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
    if (hasFiles && promptName == "Chat with Commands") {
      promptName = "Chat with Commands and Files";
    }
    if (uploadedFiles != []) {
      promptArgs["import_files"] = uploadedFiles;
    }
    const disableMemory = !enableMemory;
    const skipArgs = [
      "conversation_history",
      "context",
      "COMMANDS",
      "command_list",
      "date",
      "agent_name",
      "working_directory",
      "helper_agent_name",
      "prompt_name",
      "context_results",
      "conversation_results",
      "conversation_name",
      "prompt_category",
      "websearch",
      "websearch_depth",
      "enable_memory",
      "inject_memories_from_collection_number",
      "context_results",
      "persona",
      "",
    ];
    for (const arg of skipArgs) {
      delete promptArgs[arg];
    }
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
    if (mode == "chain") {
      promptName = selectedChain;
    }
    const response = await sdk.promptAgent(
      agentName,
      promptName,
      promptArguments
    );
    setIsLoading(false);
    setLastResponse(response);
    setUploadedFiles([]);
    const fetchConversation = async () => {
      const conversation = await sdk.getConversation(
        agentName,
        conversationName
      );
      setChatHistory(conversation);
    };
    fetchConversation();
  };

  const handleKeyPress = async (event) => {
    if (event.key === "Enter" && !event.shiftKey && message) {
      event.preventDefault();
      handleSendMessage();
    }
  };
  const handleSendMessage = async () => {
    if (mode == "chain") {
      runChain();
      setMessage("");
      return;
    } else {
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
    }
  };
  const handleLogout = async () => {
    setCookie(apiKeyCookie, undefined);
    console.log("Logging out");
    Router.reload();
  };
  return (
    <>
      {showConversationBar && (
        <ConversationSelector
          agentName={agentName}
          conversations={conversations}
          conversationName={conversationName}
          setConversationName={setConversationName}
          setConversations={setConversations}
          conversation={chatHistory}
          handleLogout={handleLogout}
          sdk={sdk}
        />
      )}
      <ConversationHistory
        agentName={agentName}
        insightAgent={insightAgent}
        chatHistory={chatHistory}
        isLoading={isLoading}
        sdk={sdk}
        topMargin={showConversationBar ? 7 : topMargin}
        setIsLoading={setIsLoading}
        setLastResponse={setLastResponse}
        conversationName={conversationName}
      />
      <TextField
        label="Ask your question here."
        placeholder="Ask your question here."
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
              {enableFileUpload && (
                <>
                  <IconButton
                    variant="contained"
                    color="info"
                    onClick={() => {
                      setUploadedFiles([]);
                      setOpenFileUpload(true);
                    }}
                    disabled={isLoading}
                    sx={{ height: "56px" }}
                  >
                    <NoteAddOutlinedIcon />
                  </IconButton>
                  <Dialog open={openFileUpload} onClose={handleCloseFileUpload}>
                    <DialogTitle id="form-dialog-title">
                      Upload Files
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        Please upload the files you would like to send.
                      </DialogContentText>
                      <input
                        accept="*"
                        id="contained-button-file"
                        multiple
                        type="file"
                        onChange={(e) => {
                          setUploadedFiles(e.target.files);
                        }}
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCloseFileUpload} color="error">
                        Cancel
                      </Button>
                      <Button
                        onClick={handleUploadFiles}
                        color="info"
                        disabled={isLoading}
                      >
                        Upload
                      </Button>
                    </DialogActions>
                  </Dialog>
                </>
              )}
              {!isLoading && (
                <Tooltip title="Send Message">
                  <IconButton
                    variant="contained"
                    color="info"
                    onClick={handleSendMessage}
                    sx={{ height: "56px", padding: "0px" }}
                  >
                    <SendIcon />
                  </IconButton>
                </Tooltip>
              )}
              {mode == "prompt" && (
                <AudioRecorder
                  conversationName={conversationName}
                  contextResults={contextResults}
                  conversationResults={conversationResults}
                  setIsLoading={setIsLoading}
                  agentName={agentName}
                  sdk={sdk}
                />
              )}
            </InputAdornment>
          ),
        }}
      />
    </>
  );
}
