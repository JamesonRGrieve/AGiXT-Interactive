// Import Storybook.
import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
// Import Component and related types.
import CodeBlockComponent, { CodeBlockProps } from './CodeBlock';
import React from 'react';
import { Button, IconButton } from '@mui/material';
import { DeleteForever } from '@mui/icons-material';
// Configure Metadata.
const meta: Meta = {
  title: 'Markdown Rendering/Code Block',
  component: CodeBlockComponent,
  tags: ['autodocs'],
  parameters: {
    componentSubtitle: 'A Sample Component',
    docs: {
      description: {
        component: 'This component is meant to illustrate how to effectively document components.',
      },
    },
    references: [],
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

// Configure Component Stories.

export const InlineCode: Story = (args: CodeBlockProps) => <CodeBlockComponent {...args} />;
InlineCode.args = {
  inline: true,
  children: 'console.log("Hello, World!");',
};

export const GenericCode: Story = (args: CodeBlockProps) => <CodeBlockComponent {...args} />;
GenericCode.args = {
  children: 'console.log("Hello, World!");\nconsole.log("Welcome to my code block!");',
};

export const MarkdownCode: Story = (args: CodeBlockProps) => <CodeBlockComponent {...args} />;
MarkdownCode.args = {
  children: '# Hello, World!\n\nThis is a markdown block.\n\n- Item 1\n- Item 2\n- Item 3',
  className: 'language-markdown',
};

export const CSVCode: Story = (args: CodeBlockProps) => <CodeBlockComponent {...args} />;
CSVCode.args = {
  children: 'Header 1, Header 2\nValue 1, Value 2\n',
  className: 'language-csv',
};

export const PythonCode: Story = (args: CodeBlockProps) => <CodeBlockComponent {...args} />;
PythonCode.args = {
  children: 'def hello_world():\n    print("Hello, World!")\n\nhello_world()',
  className: 'language-python',
};

export const JavascriptCode: Story = (args: CodeBlockProps) => <CodeBlockComponent {...args} />;
JavascriptCode.args = {
  children: 'console.log("Test");',
  className: 'language-javascript',
};
