import React from "react";
import { useTheme } from "@emotion/react";
import { useState } from "react";
import { useRouter } from "next/router";
import { Paper, Box, Typography, IconButton } from "@mui/material";
import {
  ContentCopy as ContentCopyIcon,
  Download as DownloadIcon,
  ThumbUp,
  ThumbDown,
} from "@mui/icons-material";
import clipboardCopy from "clipboard-copy";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";
import { sdk } from "../../../lib/apiClient";
import MarkdownBlock from "../../data/MarkdownBlock";
const WAIT_MESSAGE = "Let me think about that for a moment. Please wait..";

export default function ConversationHistory({ chatHistory, isLoading }) {
  const router = useRouter();
  const agentName = router.query.agent;
  const tab = router.query.tab;
  const marginTop = tab == 1 ? "400px" : tab == 3 ? "334px" : "280px";

  let lastUserMessage = ""; // track the last user message

  return (
    <Paper
      elevation={5}
      sx={{
        overflowY: "auto",
        display: "flex",
        flexDirection: "column-reverse",
        height: `calc(100vh - ${marginTop})`,
      }}
    >
      <div>
        {chatHistory
          ? chatHistory.map((chatItem, index) => {
              if (chatItem.role === "USER") {
                lastUserMessage = chatItem.message;
              }
              return (
                <ChatMessage
                  key={index}
                  chatItem={chatItem}
                  lastUserMessage={lastUserMessage} // Pass the last user message as a prop
                />
              );
            })
          : null}
        {isLoading && (
          <ChatMessage
            key={"Please Wait"}
            chatItem={{
              role: agentName,
              message: WAIT_MESSAGE,
              timestamp: "Just Now...",
            }}
            isLoading={isLoading}
          />
        )}
      </div>
    </Paper>
  );
}

const ChatMessage = ({ chatItem, lastUserMessage, isLoading }) => {
  const formattedMessage =
    typeof chatItem.message === "string"
      ? chatItem.message.replace(/\\n/g, "  \n").replace(/\n/g, "  \n")
      : chatItem.message;
  const theme = useTheme();
  const [vote, setVote] = useState(0);
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleClickOpen = (newVote) => {
    setVote(newVote);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCopyClick = () => {
    clipboardCopy(formattedMessage);
  };
  const handleDownloadClick = () => {
    const element = document.createElement("a");
    const file = new Blob([formattedMessage], {
      type: "text/plain;charset=utf-8",
    });
    element.href = URL.createObjectURL(file);
    element.download = `${chatItem.role}-${chatItem.timestamp}.txt`;
    document.body.appendChild(element);
    element.click();
  };
  return (
    <Box
      sx={{
        p: "1rem",
        backgroundColor:
          chatItem.role === "USER"
            ? theme.palette.background.default
            : theme.palette.action.selected,
      }}
    >
      <Box
        sx={{
          padding: "10px",
          marginBottom: "5px",
          overflow: "hidden",
          position: "center",
        }}
      >
        <MarkdownBlock
          content={chatItem.message}
          chatItem={chatItem}
          theme={theme}
        />
        <Typography
          variant="caption"
          style={{
            color: theme.palette.text.secondary,
            width: "100%",
            display: "inline-block",
          }}
        >
          {chatItem.role === "USER" ? "You" : chatItem.role} •{" "}
          {chatItem.timestamp}
        </Typography>
        {chatItem.role != "USER" && !isLoading && (
          <>
            <IconButton onClick={() => handleClickOpen(1)}>
              <ThumbUp color={vote === 1 ? "success" : "inherit"} />
            </IconButton>
            <IconButton onClick={() => handleClickOpen(-1)}>
              <ThumbDown color={vote === -1 ? "error" : "inherit"} />
            </IconButton>

            <IconButton onClick={handleCopyClick}>
              <ContentCopyIcon />
            </IconButton>
            <IconButton onClick={handleDownloadClick}>
              <DownloadIcon />
            </IconButton>
          </>
        )}
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Provide Feedback</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please provide some feedback regarding the message.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Feedback"
              type="text"
              fullWidth
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              color="info"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="error">
              Cancel
            </Button>
            <Button
              onClick={() => {
                const messageText = `User Feedback: ${feedback} \n\n Message: ${chatItem.message} \n\n Last User Message: ${lastUserMessage}`;
                handleClose();
                if (vote === 1) {
                  sdk.learnText(chatItem.role, lastUserMessage, messageText, 2);
                } else {
                  sdk.learnText(chatItem.role, lastUserMessage, messageText, 3);
                }
              }}
              color="info"
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};
