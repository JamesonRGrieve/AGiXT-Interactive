import React, { ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import CodeBlock from './Markdown/CodeBlock';
import renderHeading from './Markdown/Heading';
import renderLink from './Markdown/Link';
import renderList from './Markdown/List';
import renderListItem from './Markdown/ListItem';
import renderImage from './Markdown/Image';
//import remarkGfm from 'remark-gfm';

export type MarkdownBlockProps = {
  content: string;
  chatItem?: { role: string; timestamp: string; message: string };
  setLoading?: (loading: boolean) => void;
};
export default function MarkdownBlock({ content, chatItem, setLoading }: MarkdownBlockProps): ReactNode {
  const renderMessage = (): string => {
    let message = content.toString();

    // Step 1: Handle code blocks
    const codeBlockRegex = /```[\s\S]*?```/g;
    const codeBlocks = message.match(codeBlockRegex) || [];
    const placeholders = codeBlocks.map((_, i) => `__CODE_BLOCK_${i}__`);

    codeBlocks.forEach((block, i) => {
      message = message.replace(block, placeholders[i]);
    });

    // Step 2: Process line breaks and backslashes
    message = message
      .split('\n')
      .map(line => line.trim() || '\\')
      .join('\n')
      .replace(/\\\n/g, '\n')  // Remove backslashes at the end of lines
      .replace(/\n{2,}/g, match => '\n'.repeat(match.length * 2));  // Double the number of line breaks

    // Step 3: Restore code blocks
    placeholders.forEach((placeholder, i) => {
      message = message.replace(placeholder, codeBlocks[i]);
    });

    return message;
  };

  const timestamp = chatItem
    ? chatItem.timestamp.replace(/ /g, '-').replace(/:/g, '-').replace(/,/g, '')
    : new Date().toLocaleString().replace(/\D/g, '');
  const fileName = chatItem ? `${chatItem.role}-${timestamp.split('.')[0]}` : `${timestamp.split('.')[0]}`;
  try {
    return (
      <ReactMarkdown
        //remarkPlugins={[[remarkGfm]]}
        className='react-markdown'
        components={{
          a: renderLink,
          h1({ children }) {
            return renderHeading('h1', children);
          },
          h2({ children }) {
            return renderHeading('h2', children);
          },
          h3({ children }) {
            return renderHeading('h3', children);
          },
          h4({ children }) {
            return renderHeading('h4', children);
          },
          ul: renderList,
          ol: renderList,
          li: renderListItem,
          code: (props) => CodeBlock({ ...props, fileName: fileName, setLoading: setLoading }),
          img: renderImage,
        }}
      >
        {renderMessage()}
      </ReactMarkdown>
    );
  } catch (e) {
    console.error(e);
    return renderMessage();
  }
}
