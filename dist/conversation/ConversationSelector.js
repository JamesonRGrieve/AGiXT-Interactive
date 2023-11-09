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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Select, MenuItem, InputLabel, FormControl, Button, Box, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Tooltip, } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import { useState } from "react";
export default function ConversationSelector(_a) {
    var _this = this;
    var agentName = _a.agentName, conversations = _a.conversations, conversationName = _a.conversationName, setConversationName = _a.setConversationName, setConversations = _a.setConversations, conversation = _a.conversation, darkMode = _a.darkMode, handleToggleDarkMode = _a.handleToggleDarkMode, MenuDarkSwitch = _a.MenuDarkSwitch, handleLogout = _a.handleLogout, sdk = _a.sdk;
    var _b = useState(false), openNewConversation = _b[0], setOpenNewConversation = _b[1];
    var _c = useState(""), newConversationName = _c[0], setNewConversationName = _c[1];
    // Make a confirmation dialog for deleting conversations
    var _d = useState(false), openDeleteConversation = _d[0], setOpenDeleteConversation = _d[1];
    var handleAddConversation = function () { return __awaiter(_this, void 0, void 0, function () {
        var fetchConversations;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!newConversationName)
                        return [2 /*return*/];
                    return [4 /*yield*/, sdk.newConversation(agentName, newConversationName)];
                case 1:
                    _a.sent();
                    setNewConversationName("");
                    setOpenNewConversation(false);
                    fetchConversations = function () { return __awaiter(_this, void 0, void 0, function () {
                        var updatedConversations;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, sdk.getConversations()];
                                case 1:
                                    updatedConversations = _a.sent();
                                    setConversations(updatedConversations);
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    fetchConversations();
                    setConversationName(newConversationName);
                    return [2 /*return*/];
            }
        });
    }); };
    var handleDeleteConversation = function () { return __awaiter(_this, void 0, void 0, function () {
        var updatedConversations;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!conversationName)
                        return [2 /*return*/];
                    return [4 /*yield*/, sdk.deleteConversation(agentName, conversationName)];
                case 1:
                    _a.sent();
                    updatedConversations = conversations.filter(function (c) { return c !== conversationName; });
                    setConversations(updatedConversations);
                    setConversationName(updatedConversations[0] || "");
                    setOpenDeleteConversation(false);
                    return [2 /*return*/];
            }
        });
    }); };
    var handleExportConversation = function () { return __awaiter(_this, void 0, void 0, function () {
        var element, file;
        return __generator(this, function (_a) {
            if (!conversationName)
                return [2 /*return*/];
            element = document.createElement("a");
            file = new Blob([JSON.stringify(conversation)], {
                type: "application/json",
            });
            element.href = URL.createObjectURL(file);
            element.download = "".concat(conversationName, ".json");
            document.body.appendChild(element); // Required for this to work in FireFox
            element.click();
            return [2 /*return*/];
        });
    }); };
    return (_jsxs(Box, { sx: {
            display: "flex",
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
        }, children: ["\u00A0\u00A0\u00A0", _jsx(Tooltip, { title: "Select a Conversation", children: _jsxs(FormControl, { sx: {
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                    }, fullWidth: true, children: [_jsx(InputLabel, { id: "conversation-label", children: "Select a Conversation" }), _jsx(Select, { fullWidth: true, labelId: "conversation-label", label: "Select a Conversation", sx: {
                                height: "30px",
                            }, value: conversationName, onChange: function (e) { return setConversationName(e.target.value); }, children: conversations
                                ? conversations.map(function (c) { return (_jsx(MenuItem, { value: c, children: c }, c)); })
                                : null })] }) }), "\u00A0", _jsx(Tooltip, { title: "Add Conversation", children: _jsx(Button, { onClick: function () { return setOpenNewConversation(true); }, color: "info", sx: { minWidth: "20px" }, children: _jsx(AddIcon, { sx: { minWidth: "20px" }, color: "info" }) }) }), _jsx(Tooltip, { title: "Export Conversation", children: _jsx(Button, { onClick: handleExportConversation, color: "info", sx: { minWidth: "20px" }, children: _jsx(FileDownloadOutlinedIcon, { sx: { minWidth: "20px" }, color: "info" }) }) }), _jsx(Tooltip, { title: "Delete Conversation", children: _jsx(Button, { onClick: function () { return setOpenDeleteConversation(true); }, color: "error", sx: { minWidth: "20px" }, children: _jsx(DeleteIcon, { sx: { minWidth: "20px" }, color: "error" }) }) }), _jsx(Tooltip, { title: darkMode ? "Switch to Light Mode" : "Switch to Dark Mode", children: _jsx(MenuDarkSwitch, { checked: darkMode, onChange: handleToggleDarkMode }) }), _jsx(Tooltip, { title: "Logout", children: _jsx(Button, { onClick: handleLogout, color: "error", sx: { minWidth: "20px" }, children: _jsx(LogoutIcon, { sx: { minWidth: "20px" }, color: "error" }) }) }), _jsxs(Dialog, { open: openNewConversation, onClose: function () { return setOpenNewConversation(false); }, children: [_jsx(DialogTitle, { children: "Create New Conversation" }), _jsx(DialogContent, { children: _jsx(TextField, { autoFocus: true, margin: "dense", id: "name", label: "New Conversation Name", type: "text", fullWidth: true, value: newConversationName, onChange: function (e) { return setNewConversationName(e.target.value); }, variant: "outlined", color: "info" }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: function () { return setOpenNewConversation(false); }, color: "error", children: "Cancel" }), _jsx(Button, { onClick: handleAddConversation, color: "info", children: "Create" })] })] }), _jsxs(Dialog, { open: openDeleteConversation, onClose: function () { return setOpenDeleteConversation(false); }, children: [_jsx(DialogTitle, { children: "Delete Conversation" }), _jsx(DialogContent, { children: _jsx(DialogContent, { children: "Are you sure you want to delete this conversation?" }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: function () { return setOpenDeleteConversation(false); }, color: "error", children: "Cancel" }), _jsx(Button, { onClick: handleDeleteConversation, color: "info", children: "Delete" })] })] })] }));
}
