import React, { ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import { DataGridFromCSV } from './Markdown/Code/CSV';
import CodeBlock from './Markdown/CodeBlock';
import renderHeading from './Markdown/Heading';
import renderLink from './Markdown/Link';
import renderList from './Markdown/List';
import renderListItem from './Markdown/ListItem';

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
  setLoading?: (loading: boolean) => void;
};
export default function MarkdownBlock({ content, chatItem, setLoading }: MarkdownBlockProps): ReactNode {
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

          <DataGridFromCSV csvData={csvData} setLoading={setLoading} />

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
        ol: renderList,
        li: renderListItem,
        code: (props) => CodeBlock({ ...props, fileName: fileName }),
      }}
    >
      {renderMessage().toString()}
    </ReactMarkdown>
  );
}
