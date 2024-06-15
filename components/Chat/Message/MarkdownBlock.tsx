import React, { ReactNode, useContext } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link, Typography } from '@mui/material';
import { InteractiveConfigContext } from '../../../types/InteractiveConfigContext';
import { DataGridFromCSV } from './DataGridFromCSV';
import CodeBlock from './CodeBlock';

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
function extractImageOrAudio(message: string): string {
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
  return message;
}
export type MarkdownBlockProps = {
  content: string;
  chatItem?: { role: string; timestamp: string; message: string };
  setLoading: (loading: boolean) => void;
};
export default function MarkdownBlock({ content, chatItem, setLoading }: MarkdownBlockProps): ReactNode {
  const state = useContext(InteractiveConfigContext);
  const renderMessage = (): ReactNode => {
    const message = extractImageOrAudio(content.toString());

    if (message.match(/[^\\]```csv/)) {
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

  const timestamp = chatItem
    ? chatItem.timestamp.replace(/ /g, '-').replace(/:/g, '-').replace(/,/g, '')
    : new Date().toLocaleString().replace(/\D/g, '');
  const fileName = chatItem ? `${chatItem.role}-${timestamp}` : `${timestamp}`;

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
        code: (props) => CodeBlock({ ...props, fileName: fileName }),
      }}
    >
      {renderMessage().toString()}
    </ReactMarkdown>
  );
}
