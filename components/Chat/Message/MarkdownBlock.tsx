import React, { ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import CodeBlock from './Markdown/CodeBlock';
import remarkGfm from 'remark-gfm';
import ListItem from '@mui/material/ListItem';
import { List } from '@mui/material';
import MarkdownHeading from './Markdown/Heading';
import MarkdownLink from './Markdown/Link';
import MarkdownImage from './Markdown/Image';
export type MarkdownBlockProps = {
  content: string;
  chatItem?: { role: string; timestamp: string; message: string };
  setLoading?: (loading: boolean) => void;
};
export default function MarkdownBlock({ content, chatItem, setLoading }: MarkdownBlockProps): ReactNode {
  const renderMessage = (): ReactNode => {
    let message = content
      .toString()
      .replace(/\n/g, ' \n') // Add a space before each newline character
      .split('\n') // Split the message into lines.
      .map((line) => (line.trim() ? line : '\\')) // Replace empty lines (containing only \n)  with backslash.
      .join('\n') // Recombine the split lines with newlines.
      .replaceAll(/[^\\\n]\n\\\n/g, '\n\n') // Change the first slash following a line into a double linebreak.
      .replace(/[\n\\]+$/, '') // Remove any newlines or backslashes at the end of the message.
      .replace(/^[\n\\]+/, ''); // Remove any newlines or backslashes at the beginning of the message.

    const matches = [...message.matchAll(/\\```(.|\n)*```/g)];
    // Replace escaped backticks with forward ticks.
    if (matches.length > 0) {
      matches.forEach((match) => {
        message = message.replace(
          match[0],
          match[0].replaceAll('\\```', '´´´').replaceAll('```', '´´´').replaceAll('\n', '\n\n'),
        );
      });
      return message;
    }

    return message;
  };

  const timestamp = chatItem
    ? chatItem.timestamp.replace(/ /g, '-').replace(/:/g, '-').replace(/,/g, '')
    : new Date().toLocaleString().replace(/\D/g, '');
  const fileName = chatItem ? `${chatItem.role}-${timestamp.split('.')[0]}` : `${timestamp.split('.')[0]}`;
  try {
    return (
      // Switch to https://github.com/ariabuckles/simple-markdown ?
      <ReactMarkdown
        remarkPlugins={[[remarkGfm]]}
        className='react-markdown'
        components={{
          li({ children }) {
            return <ListItem sx={{ display: 'list-item', paddingY: '0.2rem' }}>{children}</ListItem>;
          },

          a({ children, ...props }) {
            return <MarkdownLink {...props}>{children}</MarkdownLink>;
          },
          h1({ children }) {
            return <MarkdownHeading tag='h1'>{children}</MarkdownHeading>;
          },
          h2({ children }) {
            return <MarkdownHeading tag='h2'>{children}</MarkdownHeading>;
          },
          h3({ children }) {
            return <MarkdownHeading tag='h3'>{children}</MarkdownHeading>;
          },
          h4({ children }) {
            return <MarkdownHeading tag='h4'>{children}</MarkdownHeading>;
          },
          h5({ children }) {
            return <MarkdownHeading tag='h5'>{children}</MarkdownHeading>;
          },
          h6({ children }) {
            return <MarkdownHeading tag='h6'>{children}</MarkdownHeading>;
          },
          ul({ children }) {
            return (
              <List
                dense
                sx={{
                  listStyle: 'disc',
                  ml: '2rem',
                  padding: '0',
                }}
              >
                {children}
              </List>
            );
          },
          ol({ children }) {
            return (
              <List
                dense
                sx={{
                  listStyle: 'decimal',
                  ml: '2rem',
                  padding: '0',
                }}
              >
                {children}
              </List>
            );
          },
          code({ ...props }) {
            return <CodeBlock {...props} fileName={fileName} setLoading={setLoading} />;
          },
          img({ src, alt }) {
            return <MarkdownImage src={src} alt={alt} />;
          },
        }}
      >
        {renderMessage().toString()}
      </ReactMarkdown>
    );
  } catch (e) {
    console.error(e);
    return renderMessage().toString();
  }
}
