import React, { ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import CodeBlock from './Markdown/CodeBlock';
import remarkGfm from 'remark-gfm';
import ListItem from '@mui/material/ListItem';
import { Box, List, Typography } from '@mui/material';
import MarkdownHeading from './Markdown/Heading';
import MarkdownLink from './Markdown/Link';
import MarkdownImage from './Markdown/Image';
import textToMarkdown from './Markdown/Preprocessor';
export type MarkdownBlockProps = {
  content: string;
  chatItem?: { role: string; timestamp: string; message: string };
  setLoading?: (loading: boolean) => void;
};
export default function MarkdownBlock({ content, chatItem, setLoading }: MarkdownBlockProps): ReactNode {
  const renderMessage = (message): string => {
    return message
      .replace(/\n/g, ' \n') // Add a space before each newline character
      .split('\n') // Split the message into lines.
      .map((line) => (line.trim() ? line : '\\')) // Replace empty lines (containing only \n)  with backslash.
      .join('\n') // Recombine the split lines with newlines.
      .replaceAll(/[^\\\n]\n\\\n/g, '\n\n') // Change the first slash following a line into a double linebreak.
      .replace(/[\n\\]+$/, '') // Remove any newlines or backslashes at the end of the message.
      .replace(/^[\n\\]+/, ''); // Remove any newlines or backslashes at the beginning of the message.
  };

  const timestamp = chatItem
    ? chatItem.timestamp.replace(/ /g, '-').replace(/:/g, '-').replace(/,/g, '')
    : new Date().toLocaleString().replace(/\D/g, '');
  const fileName = chatItem ? `${chatItem.role}-${timestamp.split('.')[0]}` : `${timestamp.split('.')[0]}`;
  try {
    return (
      // Switch to https://github.com/ariabuckles/simple-markdown ?
      textToMarkdown(content.toString()).map((segment) =>
        segment.type === undefined ? (
          <ReactMarkdown
            key={segment.content}
            remarkPlugins={[[remarkGfm]]}
            className='react-markdown'
            disallowedElements={['code']}
            components={{
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
              p({ children }) {
                return (
                  <Typography variant='body1' my='0.5rem'>
                    {children}
                  </Typography>
                );
              },
              a({ children, ...props }) {
                return <MarkdownLink {...props}>{children}</MarkdownLink>;
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
              li({ children }) {
                return (
                  <ListItem
                    sx={{
                      display: 'list-item',
                      '& .MuiTypography-body1': {
                        my: '0.25rem',
                      },
                    }}
                  >
                    {children}
                  </ListItem>
                );
              },
              code({ children }) {
                console.warn('Code resolved by ReactMarkdown should not happen in this context.');
                return <Box sx={{ backgroundColor: 'firebrick' }}>{children}</Box>;
              },
              img({ src, alt }) {
                return <MarkdownImage src={src} alt={alt} />;
              },
            }}
          >
            {renderMessage(segment.content)}
          </ReactMarkdown>
        ) : (
          <CodeBlock key={segment.content} inline={segment.type === 'code'} fileName={fileName}>
            {segment.content}
          </CodeBlock>
        ),
      )
    );
  } catch (e) {
    console.error(e);
    return renderMessage(content).toString();
  }
}
