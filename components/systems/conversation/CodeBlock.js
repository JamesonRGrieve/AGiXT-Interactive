import React from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import { solarizedlight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { IconButton } from "@mui/material";
import { ContentCopy as ContentCopyIcon } from "@mui/icons-material";
import clipboardCopy from "clipboard-copy";
// Don't forget to register the language
SyntaxHighlighter.registerLanguage("python", python);

const CodeBlock = ({ language, value }) => {
  const handleCopyClick = () => {
    clipboardCopy(value);
  };

  return (
    <div className="code-block">
      <IconButton onClick={handleCopyClick}>
        <ContentCopyIcon />
      </IconButton>
      <div className="code-container">
        {language && <div className="code-title">{language}</div>}
        <SyntaxHighlighter language={language} style={solarizedlight}>
          {value}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeBlock;
