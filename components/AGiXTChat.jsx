import { useEffect, useState } from "react";
import ConversationHistory from "./conversation/ConversationHistory";
import ConversationSelector from "./conversation/ConversationSelector";
import AudioRecorder from "./conversation/AudioRecorder";
import NoteAddOutlinedIcon from "@mui/icons-material/NoteAddOutlined";
import { setCookie, getCookie } from "cookies-next";
import Box from "@mui/material/Box";
import AGiXTSDK from "agixt";
import Tooltip from "@mui/material/Tooltip";
import { useMemo } from "react";
import {useTheme} from "@mui/material/styles";
import SwitchColorblind from 'jrgcomponents/theming/SwitchColorblind';
import SwitchDark from 'jrgcomponents/theming/SwitchDark';
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
  selectedChain, // Chain name of the selected chain if in chain mode
  chainArgs = {}, // Arguments for the chain
  enableFileUpload = false, // Enable file upload
  contextResults = 5, // Number of context results to show
  shots = 1, // Number of times to run the prompt
  browseLinks = false, // Browse links in user input to memory
  websearch = false, // Websearch user input to memory
  websearchDepth = 0, // Websearch depth
  enableMemory = false, // Enable memory training (not recommended)
  injectMemoriesFromCollectionNumber = 0, // Inject memories from a specific collection number
  conversationResults = 5, // Number of conversation results to show
  useSelectedAgent = true, // Use the selected agent to run the chain instead of what is specified in the chain
  conversationName = "Test", // Name of the conversation
  mode = "prompt", // Mode of the chat (prompt or chain)
  promptName = "Chat", // Name of the prompt to run
  promptCategory = "Default", // Category of the prompt to run
  agentName = "gpt4free", // Name of the agent to use
  insightAgent = "", // Name of the agent to use for insight
  dark = true, // Dark mode
  baseUri = "http://localhost:7437", // Base URI of the AGiXT server
  topMargin = "-35", // Top margin of the chat
  setConversationName, // Function to set the conversation name
  showConversationBar = false, // Show the conversation bar
  apiKeyCookie = "apiKey", // Name of the cookie to store the API key in
}) {
  const apiKey = getCookie(apiKeyCookie) || "";
  const sdk = useMemo(() => {
    return new AGiXTSDK({
      baseUri: baseUri,
      apiKey: apiKey,
    });
  }, [baseUri, apiKey]);
  if (insightAgent === "") {
    insightAgent = agentName;
  }
  //main: darkMode ? "#000000" : "#273043",
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
  }, [agentName, sdk]);

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
  }, [conversationName, lastResponse, agentName, sdk]);
  const theme = useTheme();
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
  }, [promptName, promptCategory, sdk]);
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
      false,
      0,
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

  return <>{!showConversationBar && (
    <Box sx={{ display: "flex", justifyContent: "flex-end", py: "0.25rem" }} component="header">
      <Tooltip
        title={
          theme.palette.mode==="dark" ? "Switch to Light Mode" : "Switch to Dark Mode"
        }
      >
        <SwitchDark />
       
      </Tooltip>
      <Tooltip
        title={
          theme.palette.colorblind ? "Switch to Normal Mode" : "Switch to Colorblind Mode"
        }
      >
      <SwitchColorblind />

       
      </Tooltip>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    </Box>
  )}
    <Box
      sx={{
        display: "flex",
        marginTop: `${showConversationBar ? 5 : topMargin}px`,
        marginRight: "1px",
        marginLeft: "1px",
      }}
      component="main"
    >
      <Box
        style={{
          maxWidth: "100%",
          flexGrow: 1,
          transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <>
          {showConversationBar && (
            <ConversationSelector
              agentName={agentName}
              conversations={conversations}
              conversationName={conversationName}
              setConversationName={setConversationName}
              setConversations={setConversations}
              conversation={chatHistory}
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
          <Box px="1rem">
          <TextField
            label="Ask your question here."
            placeholder="Ask your question here."
            multiline
            rows={2}
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{ my: 2 }}
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
                      <Dialog
                        open={openFileUpload}
                        onClose={handleCloseFileUpload}
                      >
                        <DialogTitle id="form-dialog-title">
                          Upload Files
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                            Please upload the files you would like to
                            send.
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
                          <Button
                            onClick={handleCloseFileUpload}
                            color="error"
                          >
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
          </Box>
        </>
      </Box>
    </Box></>;
}
