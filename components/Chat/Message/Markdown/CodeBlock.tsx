import { ContentCopy, Download } from '@mui/icons-material';
import { Box, Tab, Tabs, Typography, useTheme } from '@mui/material';
import clipboardCopy from 'clipboard-copy';
import React, { ReactNode } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yLight, a11yDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import TabPanel from 'jrgcomponents/Tabs/Panel';
import MarkdownBlock from '../MarkdownBlock';
import 'katex/dist/katex.min.css';
import XSV from './Code/XSV';
import Mermaid from './Code/Mermaid';
import Latex from 'react-latex-next';
import { MessageIcons as IconButton } from '../MessageIcons';

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
  tsv: 'tsv',
  flow: 'flow',
  mermaid: 'mermaid',
  sequence: 'sequence',
  gantt: 'gantt',
  verilog: 'v',
  vhdl: 'vhd',
  apex: 'cls',
  matlab: 'm',
  nim: 'nim',
  csv: 'csv',
  xml: 'xml',
  latex: 'latex',
};
const languageRenders = {
  markdown: (content) => <MarkdownBlock content={content} />,
  html: (content) => <div dangerouslySetInnerHTML={{ __html: content }} />,
  csv: (content, setLoading) => {
    const csvData = (
      content.constructor === Array
        ? content.length > 1
          ? content
          : content[0]
        : content
            .split('\n')
            .filter((row) => row.trim())
            .map((row) => row.trim())
    )
      .filter((row) => row.trim())
      .map((row) => row.trim());
    return <XSV xsvData={csvData} setLoading={setLoading} />;
  },
  tsv: (content, setLoading) => {
    const tsvData = (content.constructor === Array ? (content.length > 1 ? content : content[0]) : content.split('\n'))
      .filter((row) => row.trim())
      .map((row) => row.trim());
    //console.log(tsvData);
    return <XSV xsvData={tsvData} setLoading={setLoading} separator={/\t/} />;
  },
  gantt: (content) => <Mermaid chart={'gantt\n' + content} />,
  sequence: (content) => <Mermaid chart={'sequenceDiagram\n' + content} />,
  flow: (content) => <Mermaid chart={'flowchart TD\n' + content} />,
  mermaid: (content) => <Mermaid chart={content} />,
  latex: (content) => <Latex>{content[0]}</Latex>,
};

export type CodeBlockProps = {
  inline?: boolean;
  children?: string;
  language?: string;
  fileName?: string;
  setLoading?: (loading: boolean) => void;
};
export default function CodeBlock({
  inline = false,
  children,
  language = 'Text',
  fileName,
  setLoading,
  ...props
}: CodeBlockProps): ReactNode {
  // console.log(props);
  // console.log(children);
  // console.log(className);
  // console.log(fileName);
  // console.log(inline);
  const theme = useTheme();
  if (!language || language === 'Text') {
    const languages = Object.entries(fileExtensions).flat();
    const potentialLanguage = children.split('\n')[0].trim();
    if (languages.includes(potentialLanguage)) {
      language = potentialLanguage;
      children = children.substring(children.indexOf('\n') + 1);
    }
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const codeBlockRef = React.useRef(null);
  const fileNameWithExtension = `${fileName || 'code'}.${fileExtensions[String(language.toLowerCase())] || 'txt'}`;
  const [tab, setTab] = React.useState(0);
  //console.log(language);
  return language || children.toString().includes('\n') ? (
    <Box my='0.5rem' className='overflow-hidden border rounded-lg bg-accent text-accent-foreground'>
      <Box
        position='relative'
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        pr='1rem'
        sx={{
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
              //console.log(codeBlockRef.current);
              if (codeBlockRef.current) {
                const actualCode = codeBlockRef.current.querySelector('code').cloneNode(true);
                for (const lineNumber of actualCode.querySelectorAll('.react-syntax-highlighter-line-number')) {
                  lineNumber.remove();
                }
                //console.log(actualCode.innerText);
                clipboardCopy(actualCode.innerText);
                actualCode.remove();
              }
            }}
          >
            <ContentCopy />
          </IconButton>
          <IconButton
            onClick={() => {
              //console.log(codeBlockRef.current);
              if (codeBlockRef.current) {
                const actualCode = codeBlockRef.current.querySelector('code').cloneNode(true);
                for (const lineNumber of actualCode.querySelectorAll('.react-syntax-highlighter-line-number')) {
                  lineNumber.remove();
                }
                //console.log(actualCode.innerText);
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
  ) : (
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
