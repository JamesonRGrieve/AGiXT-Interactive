import React from "react";
import { Box, IconButton } from "@mui/material";
import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { ContentCopy as ContentCopyIcon } from "@mui/icons-material";
import DownloadIcon from "@mui/icons-material/Download";
import clipboardCopy from "clipboard-copy";

export default function MarkdownBlock({ content, chatItem }) {
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

  const renderMessage = () => {
    const message = content.toString();
    const match = message.match(/#(.*?)(?=\n|$)/);
    if (match) {
      if (message.includes("GENERATED_IMAGE:")) {
        const base64Image = match[1].replace("GENERATED_IMAGE:", "").trim();
        const formattedImage = base64Image.toString("base64");
        return message.replace(
          match[0],
          `![Generated Image](data:image/png;base64,${formattedImage})`
        );
      }
      if (message.includes("GENERATED_AUDIO:")) {
        const base64Audio = match[1].replace("GENERATED_AUDIO:", "").trim();
        const formattedAudio = base64Audio.toString("base64");
        return message.replace(
          match[0],
          `![Generated Audio](data:audio/wav;base64,${formattedAudio})`
        );
      }
    }
    return content;
  };

  return (
    <Box sx={{ flexDirection: "column" }}>
      <Box
        sx={{
          maxWidth: "100%",
          padding: "10px",
          marginBottom: "5px",
          overflow: "hidden",
          position: "center",
        }}
      >
        <ReactMarkdown
          children={renderMessage(content)}
          className="react-markdown"
          components={{
            code({ node, inline, children, ...props }) {
              if (inline) {
                return (
                  <span
                    style={{
                      backgroundColor: "darkgray",
                      borderRadius: "3px",
                      padding: "0.2em",
                      fontFamily: "monospace",
                    }}
                  >
                    {children}
                  </span>
                );
              }
              const codeBlockRef = React.useRef(null);
              const language = props.className?.replace(/language-/, "");
              const fileExtension = langMap[language] || "txt";
              const ts = chatItem
                ? chatItem.timestamp
                    .replace(/ /g, "-")
                    .replace(/:/g, "-")
                    .replace(/,/g, "")
                : new Date().toLocaleString().replace(/[^0-9]/g, "");

              const fileName = chatItem
                ? `${chatItem.role}-${ts}.${fileExtension}`
                : `${ts}.${fileExtension}`;
              return (
                <>
                  <br />
                  <div className="code-block" ref={codeBlockRef}>
                    <div className="code-title">
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

                            const element = document.createElement("a");
                            const file = new Blob([actualCode.innerText], {
                              type: "text/plain;charset=utf-8",
                            });
                            element.href = URL.createObjectURL(file);

                            element.download = fileName;
                            document.body.appendChild(element);
                            element.click();
                          }
                        }}
                      >
                        <DownloadIcon />
                      </IconButton>
                      {fileName} | {language}
                    </div>
                    <div className="code-container">
                      {language in langMap ? (
                        <SyntaxHighlighter
                          {...props}
                          children={children}
                          language={language}
                          PreTag="div"
                          showLineNumbers={true}
                          style={a11yDark}
                        />
                      ) : (
                        <code className={"code-block"} {...props}>
                          {children}
                        </code>
                      )}
                    </div>
                  </div>
                  <br />
                </>
              );
            },
          }}
        />
      </Box>
    </Box>
  );
}
