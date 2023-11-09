import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from "react";
import { useTheme } from "@emotion/react";
import { useState } from "react";
import { Paper, Box, Typography, IconButton } from "@mui/material";
import { ContentCopy as ContentCopyIcon, Download as DownloadIcon, ThumbUp, ThumbDown, } from "@mui/icons-material";
import clipboardCopy from "clipboard-copy";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Button, Tooltip, } from "@mui/material";
import MarkdownBlock from "./MarkdownBlock";
var WAIT_MESSAGE = "Let me think about that for a moment. Please wait..";
export default function ConversationHistory(_a) {
    var agentName = _a.agentName, insightAgent = _a.insightAgent, chatHistory = _a.chatHistory, isLoading = _a.isLoading, sdk = _a.sdk, topMargin = _a.topMargin, setIsLoading = _a.setIsLoading, setLastResponse = _a.setLastResponse, conversationName = _a.conversationName;
    var topPx = Number(topMargin) + 129;
    var marginTop = "".concat(topPx, "px");
    var lastUserMessage = ""; // track the last user message
    return (_jsx(Paper, { elevation: 5, sx: {
            overflowY: "auto",
            display: "flex",
            flexDirection: "column-reverse",
            height: "calc(100vh - ".concat(marginTop, ")"),
            marginTop: "0px",
        }, children: _jsxs("div", { children: [chatHistory
                    ? chatHistory.map(function (chatItem, index) {
                        if (chatItem.role === "USER") {
                            lastUserMessage = chatItem.message;
                        }
                        return (_jsx(ChatMessage, { chatItem: chatItem, sdk: sdk, lastUserMessage: lastUserMessage, setIsLoading: setIsLoading, setLastResponse: setLastResponse, conversationName: conversationName, agentName: insightAgent }, index));
                    })
                    : null, isLoading && (_jsx(ChatMessage, { chatItem: {
                        role: agentName,
                        message: WAIT_MESSAGE,
                        timestamp: "Just Now...",
                    }, isLoading: isLoading, sdk: sdk, setIsLoading: setIsLoading, setLastResponse: setLastResponse, conversationName: conversationName, agentName: insightAgent }, "Please Wait"))] }) }));
}
var ChatMessage = function (_a) {
    var chatItem = _a.chatItem, lastUserMessage = _a.lastUserMessage, isLoading = _a.isLoading, sdk = _a.sdk, setIsLoading = _a.setIsLoading, setLastResponse = _a.setLastResponse, conversationName = _a.conversationName, agentName = _a.agentName;
    var formattedMessage = typeof chatItem.message === "string"
        ? chatItem.message.replace(/\\n/g, "  \n").replace(/\n/g, "  \n")
        : chatItem.message;
    var theme = useTheme();
    var _b = useState(0), vote = _b[0], setVote = _b[1];
    var _c = useState(false), open = _c[0], setOpen = _c[1];
    var _d = useState(""), feedback = _d[0], setFeedback = _d[1];
    var handleClickOpen = function (newVote) {
        setVote(newVote);
        setOpen(true);
    };
    var handleClose = function () {
        setOpen(false);
    };
    var handleCopyClick = function () {
        clipboardCopy(formattedMessage);
    };
    var handleDownloadClick = function () {
        var element = document.createElement("a");
        var file = new Blob([formattedMessage], {
            type: "text/plain;charset=utf-8",
        });
        element.href = URL.createObjectURL(file);
        element.download = "".concat(chatItem.role, "-").concat(chatItem.timestamp, ".txt");
        document.body.appendChild(element);
        element.click();
    };
    return (_jsx(Box, { sx: {
            backgroundColor: chatItem.role === "USER"
                ? theme.palette.background.default
                : theme.palette.action.selected,
        }, children: _jsxs(Box, { sx: {
                padding: "10px",
                overflow: "hidden",
                position: "center",
            }, children: [_jsx(MarkdownBlock, { content: formattedMessage, chatItem: chatItem, theme: theme, sdk: sdk, setIsLoading: setIsLoading, setLastResponse: setLastResponse, conversationName: conversationName, agentName: agentName }), _jsxs(Typography, { variant: "caption", style: {
                        color: theme.palette.text.secondary,
                        width: "100%",
                        display: "inline-block",
                    }, children: [chatItem.role === "USER" ? "You" : chatItem.role, " \u2022", " ", chatItem.timestamp] }), chatItem.role != "USER" && !isLoading && (_jsxs(_Fragment, { children: [_jsx(Tooltip, { title: "Provide Positive Feedback", children: _jsx(IconButton, { onClick: function () { return handleClickOpen(1); }, children: _jsx(ThumbUp, { color: vote === 1 ? "success" : "inherit" }) }) }), _jsx(Tooltip, { title: "Provide Negative Feedback", children: _jsx(IconButton, { onClick: function () { return handleClickOpen(-1); }, children: _jsx(ThumbDown, { color: vote === -1 ? "error" : "inherit" }) }) }), _jsx(Tooltip, { title: "Copy Message", children: _jsx(IconButton, { onClick: handleCopyClick, children: _jsx(ContentCopyIcon, {}) }) }), _jsx(Tooltip, { title: "Download Message", children: _jsx(IconButton, { onClick: handleDownloadClick, children: _jsx(DownloadIcon, {}) }) })] })), _jsxs(Dialog, { open: open, onClose: handleClose, "aria-labelledby": "form-dialog-title", children: [_jsx(DialogTitle, { id: "form-dialog-title", children: "Provide Feedback" }), _jsxs(DialogContent, { children: [_jsx(DialogContentText, { children: "Please provide some feedback regarding the message." }), _jsx(TextField, { autoFocus: true, margin: "dense", id: "name", label: "Feedback", type: "text", fullWidth: true, value: feedback, onChange: function (e) { return setFeedback(e.target.value); }, color: "info" })] }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: handleClose, color: "error", children: "Cancel" }), _jsx(Button, { onClick: function () {
                                        var messageText = "User Feedback: ".concat(feedback, " \n\n Message: ").concat(chatItem.message, " \n\n Last User Message: ").concat(lastUserMessage);
                                        handleClose();
                                        if (vote === 1) {
                                            sdk.learnText(chatItem.role, lastUserMessage, messageText, 2);
                                        }
                                        else {
                                            sdk.learnText(chatItem.role, lastUserMessage, messageText, 3);
                                        }
                                    }, color: "info", children: "Submit" })] })] })] }) }));
};
