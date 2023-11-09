var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import ConversationHistory from "./conversation/ConversationHistory";
import ConversationSelector from "./conversation/ConversationSelector";
import AudioRecorder from "./conversation/AudioRecorder";
import NoteAddOutlinedIcon from "@mui/icons-material/NoteAddOutlined";
import { setCookie, getCookie } from "cookies-next";
import { createTheme } from "@mui/material/styles";
import { useCallback } from "react";
import { ThemeProvider } from "@mui/system";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import AGiXTSDK from "agixt";
import Tooltip from "@mui/material/Tooltip";
import Router from "next/router";
import { Button, TextField, InputAdornment, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, IconButton, } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { styled } from "@mui/material/styles";
var MenuDarkSwitch = styled(Switch)(function (_a) {
    var theme = _a.theme;
    return ({
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
                    backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"20\" width=\"20\" viewBox=\"0 0 20 20\"><path fill=\"".concat(encodeURIComponent("#fff"), "\" d=\"M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z\"/></svg>')"),
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
                backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"20\" width=\"20\" viewBox=\"0 0 20 20\"><path fill=\"".concat(encodeURIComponent("#000"), "\" d=\"M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z\"/></svg>')"),
            },
        },
        "& .MuiSwitch-track": {
            opacity: 1,
            backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
            borderRadius: 20 / 2,
        },
    });
});
export default function AGiXTChat(_a) {
    var _this = this;
    var selectedChain = _a.selectedChain, _b = _a.chainArgs, chainArgs = _b === void 0 ? {} : _b, _c = _a.enableFileUpload, enableFileUpload = _c === void 0 ? false : _c, _d = _a.contextResults, contextResults = _d === void 0 ? 5 : _d, _e = _a.shots, shots = _e === void 0 ? 1 : _e, _f = _a.browseLinks, browseLinks = _f === void 0 ? false : _f, _g = _a.websearch, websearch = _g === void 0 ? false : _g, _h = _a.websearchDepth, websearchDepth = _h === void 0 ? 0 : _h, _j = _a.enableMemory, enableMemory = _j === void 0 ? false : _j, _k = _a.injectMemoriesFromCollectionNumber, injectMemoriesFromCollectionNumber = _k === void 0 ? 0 : _k, _l = _a.conversationResults, conversationResults = _l === void 0 ? 5 : _l, _m = _a.fromStep, fromStep = _m === void 0 ? 0 : _m, _o = _a.allResponses, allResponses = _o === void 0 ? false : _o, _p = _a.useSelectedAgent, useSelectedAgent = _p === void 0 ? true : _p, _q = _a.conversationName, conversationName = _q === void 0 ? "Test" : _q, _r = _a.mode, mode = _r === void 0 ? "prompt" : _r, _s = _a.promptName, promptName = _s === void 0 ? "Chat" : _s, _t = _a.promptCategory, promptCategory = _t === void 0 ? "Default" : _t, _u = _a.agentName, agentName = _u === void 0 ? "gpt4free" : _u, _v = _a.insightAgent, insightAgent = _v === void 0 ? "" : _v, _w = _a.dark, dark = _w === void 0 ? true : _w, _x = _a.baseUri, baseUri = _x === void 0 ? "http://localhost:7437" : _x, _y = _a.topMargin, topMargin = _y === void 0 ? "-35" : _y, setConversationName = _a.setConversationName, _z = _a.showConversationBar, showConversationBar = _z === void 0 ? false : _z, _0 = _a.setLoggedIn, setLoggedIn = _0 === void 0 ? function () { } : _0;
    var apiKey = getCookie("apiKey") || "";
    var sdk = new AGiXTSDK({
        baseUri: baseUri,
        apiKey: apiKey,
    });
    var loggedIn = getCookie("loggedIn") || false;
    var isDark = getCookie("dark");
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
    var _1 = useState(dark), darkMode = _1[0], setDarkMode = _1[1];
    var themeGenerator = function (darkMode) {
        return createTheme({
            palette: {
                mode: darkMode ? "dark" : "light",
                primary: {
                    main: darkMode ? "#000000" : "#273043",
                },
            },
        });
    };
    var theme = themeGenerator(darkMode);
    var handleToggleDarkMode = useCallback(function () {
        setDarkMode(function (oldVal) {
            var newVal = !oldVal;
            setCookie("dark", newVal.toString());
            return newVal;
        });
    }, []);
    var _2 = useState([]), chatHistory = _2[0], setChatHistory = _2[1];
    var _3 = useState(""), message = _3[0], setMessage = _3[1];
    var _4 = useState(""), lastResponse = _4[0], setLastResponse = _4[1];
    var _5 = useState(false), isLoading = _5[0], setIsLoading = _5[1];
    var _6 = useState([]), uploadedFiles = _6[0], setUploadedFiles = _6[1];
    var _7 = useState(false), openFileUpload = _7[0], setOpenFileUpload = _7[1];
    var _8 = useState({}), promptArgs = _8[0], setPromptArgs = _8[1];
    var _9 = useState([]), conversations = _9[0], setConversations = _9[1];
    var _10 = useState(false), hasFiles = _10[0], setHasFiles = _10[1]; // Will add logic later
    var handleCloseFileUpload = function () {
        setOpenFileUpload(false);
    };
    var handleUploadFiles = function () { return __awaiter(_this, void 0, void 0, function () {
        var newUploadedFiles, _i, uploadedFiles_1, file, fileContent;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    newUploadedFiles = [];
                    _i = 0, uploadedFiles_1 = uploadedFiles;
                    _b.label = 1;
                case 1:
                    if (!(_i < uploadedFiles_1.length)) return [3 /*break*/, 4];
                    file = uploadedFiles_1[_i];
                    return [4 /*yield*/, file.text()];
                case 2:
                    fileContent = _b.sent();
                    newUploadedFiles.push((_a = {}, _a[file.name] = fileContent, _a));
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    setUploadedFiles(newUploadedFiles);
                    setOpenFileUpload(false);
                    return [2 /*return*/];
            }
        });
    }); };
    useEffect(function () {
        var fetchConversations = function () { return __awaiter(_this, void 0, void 0, function () {
            var convos;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sdk.getConversations(agentName)];
                    case 1:
                        convos = _a.sent();
                        setConversations(convos);
                        return [2 /*return*/];
                }
            });
        }); };
        fetchConversations();
    }, [agentName]);
    useEffect(function () {
        var fetchConversation = function () { return __awaiter(_this, void 0, void 0, function () {
            var convo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sdk.getConversation(agentName, conversationName, 100, 1)];
                    case 1:
                        convo = _a.sent();
                        setChatHistory(convo);
                        return [2 /*return*/];
                }
            });
        }); };
        fetchConversation();
    }, [conversationName, lastResponse]);
    useEffect(function () {
        var getArgs = function (promptName, promptCategory) { return __awaiter(_this, void 0, void 0, function () {
            var promptArgData, newArgs, _i, promptArgData_1, arg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sdk.getPromptArgs(promptName, promptCategory)];
                    case 1:
                        promptArgData = _a.sent();
                        if (promptArgData) {
                            newArgs = {};
                            for (_i = 0, promptArgData_1 = promptArgData; _i < promptArgData_1.length; _i++) {
                                arg = promptArgData_1[_i];
                                if (arg !== "") {
                                    newArgs[arg] = "";
                                }
                            }
                            setPromptArgs(newArgs);
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        getArgs(promptName, promptCategory);
    }, [promptName]);
    // Uploaded files will be formatted like [{"file_name": "file_content"}]
    useEffect(function () {
        setCookie("conversationName", conversationName);
    }, [conversationName]);
    var runChain = function () { return __awaiter(_this, void 0, void 0, function () {
        var agentOverride, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsLoading(true);
                    agentOverride = useSelectedAgent ? agentName : "";
                    chainArgs["conversation_name"] = conversationName;
                    return [4 /*yield*/, sdk.runChain(selectedChain, message, agentOverride, allResponses, fromStep, chainArgs)];
                case 1:
                    response = _a.sent();
                    setIsLoading(false);
                    setLastResponse(response);
                    return [2 /*return*/];
            }
        });
    }); };
    var PromptAgent = function (message, promptName, promptCategory, contextResults, shots, browseLinks, websearch, websearchDepth, enableMemory, injectMemoriesFromCollectionNumber, conversationResults) {
        if (promptName === void 0) { promptName = "Chat with Commands"; }
        if (promptCategory === void 0) { promptCategory = "Default"; }
        if (contextResults === void 0) { contextResults = 5; }
        if (shots === void 0) { shots = 1; }
        if (browseLinks === void 0) { browseLinks = false; }
        if (websearch === void 0) { websearch = false; }
        if (websearchDepth === void 0) { websearchDepth = 0; }
        if (enableMemory === void 0) { enableMemory = false; }
        if (injectMemoriesFromCollectionNumber === void 0) { injectMemoriesFromCollectionNumber = 0; }
        if (conversationResults === void 0) { conversationResults = 5; }
        return __awaiter(_this, void 0, void 0, function () {
            var disableMemory, skipArgs, _i, skipArgs_1, arg, promptArguments, response, fetchConversation;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
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
                        disableMemory = !enableMemory;
                        skipArgs = [
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
                        for (_i = 0, skipArgs_1 = skipArgs; _i < skipArgs_1.length; _i++) {
                            arg = skipArgs_1[_i];
                            delete promptArgs[arg];
                        }
                        promptArguments = __assign({ prompt_category: promptCategory, conversation_name: conversationName, context_results: contextResults, shots: shots, browse_links: browseLinks, websearch: websearch, websearch_depth: websearchDepth, disable_memory: disableMemory, inject_memories_from_collection_number: injectMemoriesFromCollectionNumber, conversation_results: conversationResults }, promptArgs);
                        if (mode == "chain") {
                            promptName = selectedChain;
                        }
                        return [4 /*yield*/, sdk.promptAgent(agentName, promptName, promptArguments)];
                    case 1:
                        response = _a.sent();
                        setIsLoading(false);
                        setLastResponse(response);
                        setUploadedFiles([]);
                        fetchConversation = function () { return __awaiter(_this, void 0, void 0, function () {
                            var conversation;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, sdk.getConversation(agentName, conversationName)];
                                    case 1:
                                        conversation = _a.sent();
                                        setChatHistory(conversation);
                                        return [2 /*return*/];
                                }
                            });
                        }); };
                        fetchConversation();
                        return [2 /*return*/];
                }
            });
        });
    };
    var handleKeyPress = function (event) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (event.key === "Enter" && !event.shiftKey && message) {
                event.preventDefault();
                handleSendMessage();
            }
            return [2 /*return*/];
        });
    }); };
    var handleSendMessage = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(mode == "chain")) return [3 /*break*/, 1];
                    runChain();
                    setMessage("");
                    return [2 /*return*/];
                case 1: return [4 /*yield*/, PromptAgent(message, promptName, promptCategory, contextResults, shots, browseLinks, websearch, websearchDepth, enableMemory, injectMemoriesFromCollectionNumber, conversationResults)];
                case 2:
                    _a.sent();
                    setMessage("");
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleLogout = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            setCookie("apiKey", undefined);
            setCookie("loggedIn", false);
            setLoggedIn(false);
            console.log("Logging out");
            Router.reload();
            return [2 /*return*/];
        });
    }); };
    return (_jsx(_Fragment, { children: loggedIn && (_jsxs(ThemeProvider, { theme: theme, children: [_jsx(CssBaseline, {}), !showConversationBar && (_jsxs(Box, { sx: { display: "flex", justifyContent: "flex-end" }, children: [_jsx(Tooltip, { title: darkMode ? "Switch to Light Mode" : "Switch to Dark Mode", children: _jsx(MenuDarkSwitch, { checked: darkMode, onChange: handleToggleDarkMode }) }), "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"] })), _jsx(Box, { sx: {
                        display: "flex",
                        marginTop: "".concat(showConversationBar ? 5 : topMargin, "px"),
                        marginRight: "1px",
                        marginLeft: "1px",
                    }, children: _jsx("main", { style: {
                            maxWidth: "100%",
                            flexGrow: 1,
                            transition: theme.transitions.create("margin", {
                                easing: theme.transitions.easing.sharp,
                                duration: theme.transitions.duration.leavingScreen,
                            }),
                        }, children: _jsxs(_Fragment, { children: [showConversationBar && (_jsx(ConversationSelector, { agentName: agentName, conversations: conversations, conversationName: conversationName, setConversationName: setConversationName, setConversations: setConversations, conversation: chatHistory, darkMode: darkMode, handleToggleDarkMode: handleToggleDarkMode, MenuDarkSwitch: MenuDarkSwitch, handleLogout: handleLogout, sdk: sdk })), _jsx(ConversationHistory, { agentName: agentName, insightAgent: insightAgent, chatHistory: chatHistory, isLoading: isLoading, sdk: sdk, topMargin: showConversationBar ? 7 : topMargin, setIsLoading: setIsLoading, setLastResponse: setLastResponse, conversationName: conversationName }), _jsx(TextField, { label: "Ask your question here.", placeholder: "Ask your question here.", multiline: true, rows: 2, fullWidth: true, value: message, onChange: function (e) { return setMessage(e.target.value); }, onKeyPress: handleKeyPress, sx: { mb: 2 }, disabled: isLoading, InputProps: {
                                        endAdornment: (_jsxs(InputAdornment, { position: "end", children: [enableFileUpload && (_jsxs(_Fragment, { children: [_jsx(IconButton, { variant: "contained", color: "info", onClick: function () {
                                                                setUploadedFiles([]);
                                                                setOpenFileUpload(true);
                                                            }, disabled: isLoading, sx: { height: "56px" }, children: _jsx(NoteAddOutlinedIcon, {}) }), _jsxs(Dialog, { open: openFileUpload, onClose: handleCloseFileUpload, children: [_jsx(DialogTitle, { id: "form-dialog-title", children: "Upload Files" }), _jsxs(DialogContent, { children: [_jsx(DialogContentText, { children: "Please upload the files you would like to send." }), _jsx("input", { accept: "*", id: "contained-button-file", multiple: true, type: "file", onChange: function (e) {
                                                                                setUploadedFiles(e.target.files);
                                                                            } })] }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: handleCloseFileUpload, color: "error", children: "Cancel" }), _jsx(Button, { onClick: handleUploadFiles, color: "info", disabled: isLoading, children: "Upload" })] })] })] })), !isLoading && (_jsx(Tooltip, { title: "Send Message", children: _jsx(IconButton, { variant: "contained", color: "info", onClick: handleSendMessage, sx: { height: "56px", padding: "0px" }, children: _jsx(SendIcon, {}) }) })), mode == "prompt" && (_jsx(AudioRecorder, { conversationName: conversationName, contextResults: contextResults, conversationResults: conversationResults, setIsLoading: setIsLoading, agentName: agentName, sdk: sdk }))] })),
                                    } })] }) }) })] })) }));
}
