import React from "react";
import { Paper, Box, Typography, IconButton } from "@mui/material";
import { ThumbUp, ThumbDown } from "@mui/icons-material";
import ReactMarkdown from "react-markdown";
import { useTheme } from "@emotion/react";
import { useState } from "react";

export default function ConversationHistory({ chatHistory }) {
  return (
    <Paper
      elevation={5}
      sx={{
        overflowY: "auto",
        display: "flex",
        flexDirection: "column-reverse",
        height: "50vh",
      }}
    >
      <div style={{ width: "100%" }}>
        {chatHistory.map((chatItem, index) => (
          <ChatMessage key={index} chatItem={chatItem} />
        ))}
      </div>
    </Paper>
  );
}
const ChatMessage = ({ chatItem }) => {
  const formattedMessage = chatItem.message
    .replace(/\\n/g, "  \n")
    .replace(/\n/g, "  \n");
  const theme = useTheme();
  const [vote, setVote] = useState(0);

  return (
    /* Message Wrapper */
    <Box
      sx={{
        p: "1rem",
        display: "flex",
        flexDirection: chatItem.role === "USER" ? "row-reverse" : "row",
        backgroundColor:
          chatItem.role === "USER"
            ? theme.palette.background.default
            : theme.palette.action.selected,
      }}
    >
      <Box sx={{ flexDirection: "column" }}>
        {/* Message */}
        <Box
          sx={{
            maxWidth: "calc(100%-1rem)",
            padding: "10px",
            marginBottom: "5px",
            overflow: "hidden",
          }}
        >
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <CodeBlock
                    language={match[1]}
                    value={String(children).replace(/\n$/, "")}
                    {...props}
                  />
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {formattedMessage}
          </ReactMarkdown>
        </Box>
        {/* Caption */}
        <Typography
          variant="caption"
          style={{
            color: theme.palette.text.secondary,
            width: "100%",
            textAlign: chatItem.role === "USER" ? "right" : "left",
            display: "inline-block",
          }}
        >
          {chatItem.role === "USER" ? "You" : chatItem.role} •{" "}
          {chatItem.timestamp}
        </Typography>

        <IconButton onClick={() => setVote(vote === 1 ? 0 : 1)}>
          <ThumbUp color={vote === 1 ? "primary" : "inherit"} />
        </IconButton>
        <IconButton onClick={() => setVote(vote === -1 ? 0 : -1)}>
          <ThumbDown color={vote === -1 ? "error" : "inherit"} />
        </IconButton>
      </Box>
    </Box>
  );
};
