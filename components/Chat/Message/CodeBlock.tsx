import { ContentCopy, Download } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import clipboardCopy from 'clipboard-copy';
import React, { ReactNode } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

const langMap = {
  '': 'txt',
  python: 'py',
  javascript: 'js',
  typescript: 'ts',
  html: 'html',
  css: 'css',
  json: 'json',
  yaml: 'yaml',
  markdown: 'md',
  shell: 'sh',
  bash: 'sh',
  sql: 'sql',
  java: 'java',
  c: 'c',
  cpp: 'cpp',
  csharp: 'cs',
  go: 'go',
  rust: 'rs',
  php: 'php',
  ruby: 'rb',
  perl: 'pl',
  lua: 'lua',
  r: 'r',
  swift: 'swift',
  kotlin: 'kt',
  scala: 'scala',
  clojure: 'clj',
  elixir: 'ex',
  erlang: 'erl',
  haskell: 'hs',
  ocaml: 'ml',
  pascal: 'pas',
  scheme: 'scm',
  coffeescript: 'coffee',
  fortran: 'f',
  julia: 'jl',
  lisp: 'lisp',
  prolog: 'pro',
  vbnet: 'vb',
  dart: 'dart',
  fsharp: 'fs',
  groovy: 'groovy',
  perl6: 'pl',
  powershell: 'ps1',
  puppet: 'pp',
  qml: 'qml',
  racket: 'rkt',
  sas: 'sas',
  verilog: 'v',
  vhdl: 'vhd',
  apex: 'cls',
  matlab: 'm',
  nim: 'nim',
};

export default function CodeBlock({
  inline,
  children,
  className,
  fileName,
  ...props
}: {
  inline?: boolean;
  children: ReactNode;
  className?: string;
  fileName?: string;
}): ReactNode {
  if (inline) {
    return (
      <span
        style={{
          backgroundColor: 'darkgray',
          borderRadius: '3px',
          padding: '0.2em',
          fontFamily: 'monospace',
        }}
      >
        {children}
      </span>
    );
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const codeBlockRef = React.useRef(null);
  const language = className?.replace(/language-/, '') || 'markdown';
  const fileNameWithExtension = `${fileName || 'code'}.${langMap[String(language)] || 'md'}`;

  return (
    <>
      <br />
      <div className='code-block' ref={codeBlockRef}>
        <div className='code-title'>
          <IconButton
            onClick={() => {
              if (codeBlockRef.current) {
                const actualCode = codeBlockRef.current.querySelector('code');
                clipboardCopy(actualCode.innerText);
              }
            }}
          >
            <ContentCopy />
          </IconButton>
          <IconButton
            onClick={() => {
              if (codeBlockRef.current) {
                const actualCode = codeBlockRef.current.querySelector('code');

                const element = document.createElement('a');
                const file = new Blob([actualCode.innerText], {
                  type: 'text/plain;charset=utf-8',
                });
                element.href = URL.createObjectURL(file);

                element.download = fileNameWithExtension;
                document.body.appendChild(element);
                element.click();
              }
            }}
          >
            <Download />
          </IconButton>
          {fileNameWithExtension} | {language}
        </div>
        <div className='code-container'>
          {language in langMap ? (
            <SyntaxHighlighter
              {...props}
              // eslint-disable-next-line react/no-children-prop
              children={children}
              language={language}
              PreTag='div'
              style={a11yDark}
            />
          ) : (
            <code className={'code-block'} {...props}>
              {children}
            </code>
          )}
        </div>
      </div>
      <br />
    </>
  );
}
