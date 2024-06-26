import React, { ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import CodeBlock from './Markdown/CodeBlock';
import renderHeading from './Markdown/Heading';
import renderLink from './Markdown/Link';
import renderList from './Markdown/List';
import renderListItem from './Markdown/ListItem';
import renderImage from './Markdown/Image';
import remarkGfm from 'remark-gfm';
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
      .split('\n')
      .map((line) => (line.trim() ? line : '\\'))
      .join('\n')
      .replaceAll(/[^\\\n]\n\\\n/g, '\n\n');

    const matches = [...message.matchAll(/\\```(.|\n)*```/g)];
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
          // @ts-ignore
          a: renderLink,
          // @ts-ignore
          h1({ children }) {
            return renderHeading('h1', children);
          },
          // @ts-ignore
          h2({ children }) {
            return renderHeading('h2', children);
          },
          // @ts-ignore
          h3({ children }) {
            return renderHeading('h3', children);
          },
          // @ts-ignore
          h4({ children }) {
            return renderHeading('h4', children);
          },
          // @ts-ignore
          ul: renderList,
          // @ts-ignore
          ol: renderList,
          // @ts-ignore
          li: renderListItem,
          // @ts-ignore
          code: (props) => CodeBlock({ ...props, fileName: fileName, setLoading: setLoading }),
          // @ts-ignore
          img: renderImage,
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
