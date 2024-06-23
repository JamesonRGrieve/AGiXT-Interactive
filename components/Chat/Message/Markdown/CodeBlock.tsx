import { ContentCopy, Download } from '@mui/icons-material';
import { Box, IconButton, Tab, Tabs, Typography, useTheme } from '@mui/material';
import clipboardCopy from 'clipboard-copy';
import React, { ReactNode } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yLight, a11yDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import TabPanel from 'jrgcomponents/Tabs/Panel';
import MarkdownBlock from '../MarkdownBlock';
import CSV from './Code/CSV';

const fileExtensions = {
  '': 'txt',
  text: 'txt',
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
  csv: 'csv',
};
const languageRenders = {
  markdown: (content) => <MarkdownBlock content={content} />,
  csv: (content, setLoading) => {
    console.log('Content: ', content[0].split('\n'));
    // TODO Figure out why the [0] is necessary, this should come in as a string.
    return <CSV csvData={content[0].split && content[0].split('\n').filter((row) => row.trim())} setLoading={setLoading} />;
  },
};

export type CodeBlockProps = {
  inline?: boolean;
  children: ReactNode;
  className?: string;
  fileName?: string;
  setLoading?: (loading: boolean) => void;
};
export default function CodeBlock({
  inline = false,
  children,
  className,
  fileName,
  setLoading,
  ...props
}: CodeBlockProps): ReactNode {
  const theme = useTheme();
  if (inline) {
    return (
      <Typography
        component='span'
        sx={{
          backgroundColor: theme.palette.divider,
          borderRadius: '0.5rem',
          padding: '0.1rem 0.25rem',
          fontFamily: 'monospace',
        }}
      >
        {children}
      </Typography>
    );
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const codeBlockRef = React.useRef(null);
  const language = className?.replace(/language-/, '') || 'Text';
  const fileNameWithExtension = `${fileName || 'code'}.${fileExtensions[String(language.toLowerCase())] || 'txt'}`;
  const [tab, setTab] = React.useState(0);
  console.log(theme.palette.mode === 'dark' ? a11yDark.hljs.background : a11yLight.hljs.background);
  console.log(a11yLight);
  console.log(a11yDark);
  return (
    <Box pr='1rem' my='0.5rem'>
      <Box
        position='relative'
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        sx={{
          backgroundColor: theme.palette.mode === 'dark' ? a11yDark.hljs.background : a11yLight.hljs.background,
          borderBottom: '2px solid ' + theme.palette.divider,
        }}
      >
        {Object.keys(languageRenders).includes(language) && (
          <Tabs value={tab} onChange={(event, newValue) => setTab(newValue)}>
            {Object.keys(languageRenders).includes(language) && <Tab label='Rendered' />}
            <Tab label='Source' />
          </Tabs>
        )}
        <Box>
          <IconButton
            onClick={() => {
              console.log(codeBlockRef.current);
              if (codeBlockRef.current) {
                const actualCode = codeBlockRef.current.querySelector('code').cloneNode(true);
                for (const lineNumber of actualCode.querySelectorAll('.react-syntax-highlighter-line-number')) {
                  lineNumber.remove();
                }
                console.log(actualCode.innerText);
                clipboardCopy(actualCode.innerText);
                actualCode.remove();
              }
            }}
          >
            <ContentCopy />
          </IconButton>
          <IconButton
            onClick={() => {
              console.log(codeBlockRef.current);
              if (codeBlockRef.current) {
                const actualCode = codeBlockRef.current.querySelector('code').cloneNode(true);
                for (const lineNumber of actualCode.querySelectorAll('.react-syntax-highlighter-line-number')) {
                  lineNumber.remove();
                }
                console.log(actualCode.innerText);
                const element = document.createElement('a');
                const file = new Blob([actualCode.innerText], {
                  type: 'text/plain;charset=utf-8',
                });
                element.href = URL.createObjectURL(file);

                element.download = fileNameWithExtension;
                document.body.appendChild(element);
                element.click();
                actualCode.remove();
              }
            }}
          >
            <Download />
          </IconButton>
          {fileNameWithExtension} | {language}
        </Box>
      </Box>

      {Object.keys(languageRenders).includes(language) && (
        <TabPanel value={tab} index={0} className='code-block'>
          <Box className='code-container'>{languageRenders[language.toString()](children, setLoading)}</Box>
        </TabPanel>
      )}

      <TabPanel value={tab} index={Object.keys(languageRenders).includes(language) ? 1 : 0} className='code-block'>
        <Box className='code-container' ref={codeBlockRef}>
          {language.toLowerCase() in fileExtensions ? (
            <SyntaxHighlighter
              {...props}
              // eslint-disable-next-line react/no-children-prop
              children={children}
              language={language.toLowerCase()}
              PreTag='div'
              style={theme.palette.mode === 'dark' ? a11yDark : a11yLight}
              showLineNumbers
              wrapLongLines
            />
          ) : (
            <code className={'code-block'} {...props}>
              {children}
            </code>
          )}
        </Box>
      </TabPanel>
    </Box>
  );
}
