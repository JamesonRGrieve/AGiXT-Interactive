import React, { ReactNode, useContext } from 'react';
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import clipboardCopy from 'clipboard-copy';
import { IconButton, Link, Typography } from '@mui/material';
import { ContentCopy as ContentCopyIcon, Download as DownloadIcon } from '@mui/icons-material';
import { InteractiveConfigContext } from '../types/InteractiveConfigContext';
import { DataGridFromCSV } from './DataGridFromCSV';

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

export default function MarkdownBlock({
  content,
  chatItem,
  setLoading,
}: {
  content: string;
  chatItem?: { role: string; timestamp: string };
  setLoading: (loading: boolean) => void;
}): ReactNode {
  const state = useContext(InteractiveConfigContext);
  const renderMessage = (): ReactNode => {
    const message = content.toString();
    const match = message.match(/#(.*?)(?=\n|$)/);
    if (match) {
      if (message.includes('GENERATED_IMAGE:')) {
        const base64Image = match[1].replace('GENERATED_IMAGE:', '').trim();
        const formattedImage = base64Image.toString();
        return message.replace(match[0], `![Generated Image](data:image/png;base64,${formattedImage})`);
      }
      if (message.includes('GENERATED_AUDIO:')) {
        const base64Audio = match[1].replace('GENERATED_AUDIO:', '').trim();
        const formattedAudio = base64Audio.toString();
        return message.replace(match[0], `![Generated Audio](data:audio/wav;base64,${formattedAudio})`);
      }
    }
    if (message.includes('```csv')) {
      // Get the csv data between ```csv and ```
      const splitMessage = message.split('```csv');
      let csvData = splitMessage[1].split('```')[0].split(/[ \t]+\n/g);
      csvData = csvData.splice(1, csvData.length - (csvData[csvData.length - 1].trim() === '' ? 2 : 1));
      console.log('```\n' + csvData.join('\n') + '\n```');
      return (
        <>
          <MarkdownBlock content={splitMessage[0]?.split('```markdown')[0]} chatItem={chatItem} setLoading={setLoading} />

          <DataGridFromCSV state={state} csvData={csvData} setLoading={setLoading} />

          {splitMessage.length > 2 && splitMessage[2].trim() && (
            <MarkdownBlock content={splitMessage[2]} chatItem={chatItem} setLoading={setLoading} />
          )}
        </>
      );
    }
    if (message.includes('<audio controls><source src=')) {
      // Replace the html audio control with a link to the audio
      const match = message.match(/<audio controls><source src="(.*)" type="audio\/wav"><\/audio>/);
      // We can reformat it any way we want for testing like this.
      return message.replace(match[0], '');
    }
    return content;
  };
  const generateId = (text): string => {
    return text ? text.toLowerCase().replace(/\W+/g, '-') : '';
  };
  const handleAnchorClick = (e): void => {
    const href = e.target.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      const id = href.slice(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      e.preventDefault();
      window.open(href, '_blank');
    }
  };

  const renderHeader = (Tag, children): ReactNode => {
    let text = '';
    if (children && children[0]) {
      text = children[0];
    }
    const id = generateId(text);
    return (
      <Typography component={Tag} id={id}>
        {children}
      </Typography>
    );
  };
  const renderLink = ({ children, ...props }): ReactNode => {
    const isExternal = props.href && !props.href.startsWith('#');
    return (
      <Link
        {...props}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        onClick={isExternal ? undefined : handleAnchorClick}
      >
        {children}
      </Link>
    );
  };
  const renderList = (children, ordered = true): ReactNode => {
    return ordered ? <ol style={{ paddingLeft: '2em' }}>{children}</ol> : <ul>{children}</ul>;
  };
  const renderListItem = ({ children }): ReactNode => {
    return <li style={{ marginBottom: '0.5em' }}>{children}</li>;
  };
  const renderCode = ({
    inline,
    children,
    className,
    ...props
  }: {
    inline?: boolean;
    children: ReactNode;
    className?: string;
  }): ReactNode => {
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
    const fileExtension = langMap[String(language)] || 'md';
    const ts = chatItem
      ? chatItem.timestamp.replace(/ /g, '-').replace(/:/g, '-').replace(/,/g, '')
      : new Date().toLocaleString().replace(/\D/g, '');

    const fileName = chatItem ? `${chatItem.role}-${ts}.${fileExtension}` : `${ts}.${fileExtension}`;
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
              <ContentCopyIcon />
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
  };
  return content.includes('```csv') ? (
    renderMessage()
  ) : (
    <ReactMarkdown
      className='react-markdown'
      components={{
        a: renderLink,
        h1({ children }) {
          return renderHeader('h1', children);
        },
        h2({ children }) {
          return renderHeader('h2', children);
        },
        h3({ children }) {
          return renderHeader('h3', children);
        },
        h4({ children }) {
          return renderHeader('h4', children);
        },
        ol: renderList,
        li: renderListItem,
        code: renderCode,
      }}
    >
      {renderMessage().toString()}
    </ReactMarkdown>
  );
}
