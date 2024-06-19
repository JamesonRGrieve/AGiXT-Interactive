// Import Storybook.
import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
// Import Component and related types.
import MessageComponent, { MessageProps } from './Message';
import React from 'react';
import { Button, IconButton } from '@mui/material';
import { DeleteForever } from '@mui/icons-material';
// Configure Metadata.
const meta: Meta = {
  title: 'Messaging/Message',
  component: MessageComponent,
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

export const InlineCode: Story = (args: MessageProps) => <MessageComponent {...args} />;
InlineCode.args = {
  inline: true,
  children: 'console.log("Hello, World!");',
};

export const GenericCode: Story = (args: MessageProps) => <MessageComponent {...args} />;
GenericCode.args = {
  children: 'console.log("Hello, World!");\nconsole.log("Welcome to my code block!");',
};

export const MarkdownCode: Story = (args: MessageProps) => <MessageComponent {...args} />;
MarkdownCode.args = {
  children: '# Hello, World!\n\nThis is a markdown block.\n\n- Item 1\n- Item 2\n- Item 3',
  className: 'language-markdown',
};

export const CSVCode: Story = (args: MessageProps) => <MessageComponent {...args} />;
CSVCode.args = {
  children: 'FirstName, LastName, Age\nJohn, Doe, 30\nJane, Doe, 28\nAlice, Smith, 35',
  className: 'language-csv',
};

export const PythonCode: Story = (args: MessageProps) => <MessageComponent {...args} />;
PythonCode.args = {
  children: 'def hello_world():\n    print("Hello, World!")\n\nhello_world()',
  className: 'language-python',
};

export const JavascriptCode: Story = (args: MessageProps) => <MessageComponent {...args} />;
JavascriptCode.args = {
  children: 'console.log("Test");',
  className: 'language-javascript',
};
