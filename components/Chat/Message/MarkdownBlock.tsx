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
  const renderMessage = (): ReactNode => {
  let message = content
    .toString()
    .split('\n')
    .map((line) => (line.trim() ? line : '\\'))
    .join('\n')
    .replaceAll(/(?<!\\)\n\\\n/g, '\n\n');

    const matches = [...message.matchAll(/\\```(.|\n)*```/g)];
    if (matches.length > 0) {
      //replace the triple backticks of those matches with the strings "(start escaped codeblock)" and "(end escaped codeblock)"
      matches.forEach((match) => {
        //console.log(match);
        message = message.replace(
          match[0],
          match[0].replaceAll('\\```', '´´´').replaceAll('```', '´´´').replaceAll('\n', '\n\n'),
        );
        //console.log(message);
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
        {renderMessage().toString()}
      </ReactMarkdown>
    );
  } catch (e) {
    console.error(e);
    return renderMessage().toString();
  }
}
