import React, { ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import CodeBlock from './Markdown/CodeBlock';
import renderHeading from './Markdown/Heading';
import renderLink from './Markdown/Link';
import renderList from './Markdown/List';
import renderListItem from './Markdown/ListItem';
import renderImage from './Markdown/Image';

export type MarkdownBlockProps = {
  content: string;
  chatItem?: { role: string; timestamp: string; message: string };
  setLoading?: (loading: boolean) => void;
};

export default function MarkdownBlock({ content, chatItem, setLoading }: MarkdownBlockProps): ReactNode {
  const renderMessage = (): string => {
    let message = content.toString();

    // Preserve empty lines and ensure proper line breaks
    message = message.split('\n').map(line => line.trim() ? line : ' ').join('\n');

    // Handle escaped code blocks
    const codeBlockRegex = /\\```([\s\S]*?)```/g;
    message = message.replace(codeBlockRegex, (match) => {
      return match
        .replace(/\\```/g, '´´´')
        .replace(/```/g, '´´´')
        .replace(/\n/g, '\n\n');
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
        className='react-markdown'
        components={{
          a: renderLink,
          h1: ({ children }) => renderHeading('h1', children),
          h2: ({ children }) => renderHeading('h2', children),
          h3: ({ children }) => renderHeading('h3', children),
          h4: ({ children }) => renderHeading('h4', children),
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