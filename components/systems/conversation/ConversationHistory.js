import React from "react";
import { useRouter } from "next/router";
import { Paper, Box, Typography, IconButton } from "@mui/material";
import { ThumbUp, ThumbDown } from "@mui/icons-material";
import ReactMarkdown from "react-markdown";
import { useTheme } from "@emotion/react";
import { useState } from "react";
import { ContentCopy as ContentCopyIcon } from "@mui/icons-material";
import DownloadIcon from "@mui/icons-material/Download";
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

export default function ConversationHistory({ chatHistory }) {
  const router = useRouter();
  const pageName = router.pathname.split("/")[1];
  const tab = router.query.tab;

  let lastUserMessage = ""; // track the last user message

  return (
    <Paper
      elevation={5}
      sx={{
        overflowY: "auto",
        display: "flex",
        flexDirection: "column-reverse",
        height: tab == 1 ? "65vh" : tab == 3 ? "70vh" : "75vh",
      }}
    >
      <div style={{ width: "100%" }}>
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
      </div>
    </Paper>
  );
}

const ChatMessage = ({ chatItem, lastUserMessage }) => {
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
        display: "flex",
        flexDirection: chatItem.role === "USER" ? "row-reverse" : "row",
        backgroundColor:
          chatItem.role === "USER"
            ? theme.palette.background.default
            : theme.palette.action.selected,
      }}
    >
      <Box sx={{ flexDirection: "column" }}>
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
              code({ node, inline, children, ...props }) {
                const codeBlockRef = React.useRef(null);
                const language = props.className?.replace(/language-/, "");

                return (
                  <>
                    <br />
                    <div className="code-block" ref={codeBlockRef}>
                      <div className="code-container">
                        {language && (
                          <div className="code-title">{language}</div>
                        )}
                        <IconButton
                          onClick={() => {
                            if (codeBlockRef.current) {
                              const actualCode =
                                codeBlockRef.current.querySelector("code");
                              clipboardCopy(actualCode.innerText);
                            }
                          }}
                        >
                          <ContentCopyIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            if (codeBlockRef.current) {
                              const actualCode =
                                codeBlockRef.current.querySelector("code");
                              const lang = codeBlockRef.current.querySelector(
                                ".code-title"
                              )
                                ? codeBlockRef.current.querySelector(
                                    ".code-title"
                                  ).innerText
                                : "";
                              const langMap = {
                                "": "txt",
                                python: "py",
                                javascript: "js",
                                typescript: "ts",
                                html: "html",
                                css: "css",
                                json: "json",
                                yaml: "yaml",
                                markdown: "md",
                                shell: "sh",
                                bash: "sh",
                                sql: "sql",
                                java: "java",
                                c: "c",
                                cpp: "cpp",
                                csharp: "cs",
                                go: "go",
                                rust: "rs",
                                php: "php",
                                ruby: "rb",
                                perl: "pl",
                                lua: "lua",
                                r: "r",
                                swift: "swift",
                                kotlin: "kt",
                                scala: "scala",
                                clojure: "clj",
                                elixir: "ex",
                                erlang: "erl",
                                haskell: "hs",
                                ocaml: "ml",
                                pascal: "pas",
                                scheme: "scm",
                                coffeescript: "coffee",
                                fortran: "f",
                                julia: "jl",
                                lisp: "lisp",
                                prolog: "pro",
                                vbnet: "vb",
                                dart: "dart",
                                fsharp: "fs",
                                groovy: "groovy",
                                perl6: "pl",
                                powershell: "ps1",
                                puppet: "pp",
                                qml: "qml",
                                racket: "rkt",
                                sas: "sas",
                                verilog: "v",
                                vhdl: "vhd",
                                apex: "cls",
                                matlab: "m",
                                nim: "nim",
                                ocaml: "ml",
                                pascal: "pas",
                                scheme: "scm",
                                coffeescript: "coffee",
                              };

                              const element = document.createElement("a");
                              const file = new Blob([actualCode.innerText], {
                                type: "text/plain;charset=utf-8",
                              });
                              element.href = URL.createObjectURL(file);
                              element.download = `${chatItem.role}-${
                                chatItem.timestamp
                              }.${langMap[lang] || "txt"}`;
                              document.body.appendChild(element);
                              element.click();
                            }
                          }}
                        >
                          <DownloadIcon />
                        </IconButton>
                        <code className={"code-block"} {...props}>
                          {children}
                        </code>
                      </div>
                    </div>
                    <br />
                  </>
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
        {chatItem.role != "USER" && (
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
