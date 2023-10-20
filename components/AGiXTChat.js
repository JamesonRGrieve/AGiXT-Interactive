import { useEffect, useState } from "react";
import ConversationHistory from "./conversation/ConversationHistory";
import ConversationSelector from "./conversation/ConversationSelector";
import AudioRecorder from "./conversation/AudioRecorder";
import Auth from "./Auth";
import NoteAddOutlinedIcon from "@mui/icons-material/NoteAddOutlined";
import { setCookie, getCookie } from "cookies-next";
import { createTheme } from "@mui/material/styles";
import { useCallback } from "react";
import { ThemeProvider } from "@mui/system";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import AGiXTSDK from "agixt";
import Tooltip from "@mui/material/Tooltip";

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

const MenuDarkSwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.colorblind
      ? theme.palette.mode === "dark"
        ? "#000"
        : "#fff"
      : theme.palette.mode === "dark"
      ? "#003892"
      : "#f0e70a",
    width: 32,
    height: 32,
    "&:before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        "#000"
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
    borderRadius: 20 / 2,
  },
}));

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
  dark = true,
  baseUri = "http://localhost:7437",
  topMargin = "-35",
  setConversationName,
  showConversationBar = false,
}) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userKey, setUserKey] = useState("");
  const apiKey = getCookie("apiKey") || "";
  const sdk = new AGiXTSDK({
    baseUri: baseUri,
    apiKey: apiKey,
  });
  let isDark = getCookie("dark");
  isDark === undefined
    ? setCookie("dark", dark)
    : isDark === "true"
    ? (dark = true)
    : isDark === "false"
    ? (dark = false)
    : (dark = false);
  if (insightAgent === "") {
    insightAgent = agentName;
  }
  const [darkMode, setDarkMode] = useState(dark);
  const themeGenerator = (darkMode) =>
    createTheme({
      palette: {
        mode: darkMode ? "dark" : "light",
        primary: {
          main: darkMode ? "#000000" : "#273043",
        },
      },
    });
  const theme = themeGenerator(darkMode);
  const handleToggleDarkMode = useCallback(() => {
    setDarkMode((oldVal) => {
      const newVal = !oldVal;
      setCookie("dark", newVal.toString());
      return newVal;
    });
  }, []);
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
    // Login
    const loggedInC = getCookie("loggedIn");
    if (loggedInC) {
      setLoggedIn(true);
    }
    const userApiKey = getCookie("apiKey");
    if (userApiKey) {
      setUserKey(userApiKey);
    }
  }, []);
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
  const handleLogin = async () => {
    setCookie("apiKey", userKey);
    setLoggedIn(true);
    setCookie("loggedIn", loggedIn);
  };
  const handleLogout = async () => {
    setCookie("apiKey", "");
    setLoggedIn(false);
    setCookie("loggedIn", false);
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {!showConversationBar && (
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Tooltip
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              <MenuDarkSwitch
                checked={darkMode}
                onChange={handleToggleDarkMode}
              />
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
        >
          <main
            style={{
              maxWidth: "100%",
              flexGrow: 1,
              transition: theme.transitions.create("margin", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
            }}
          >
            {!loggedIn && (
              <Auth
                userKey={userKey}
                handleLogin={handleLogin}
                darkMode={darkMode}
                handleToggleDarkMode={handleToggleDarkMode}
                MenuDarkSwitch={MenuDarkSwitch}
              />
            )}
            {loggedIn && (
              <>
                {showConversationBar && (
                  <ConversationSelector
                    agentName={agentName}
                    conversations={conversations}
                    conversationName={conversationName}
                    setConversationName={setConversationName}
                    setConversations={setConversations}
                    conversation={chatHistory}
                    darkMode={darkMode}
                    handleToggleDarkMode={handleToggleDarkMode}
                    MenuDarkSwitch={MenuDarkSwitch}
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
                        <AudioRecorder
                          conversationName={conversationName}
                          contextResults={contextResults}
                          conversationResults={conversationResults}
                          setIsLoading={setIsLoading}
                          agentName={agentName}
                          sdk={sdk}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
              </>
            )}
          </main>
        </Box>
      </ThemeProvider>
    </>
  );
}
