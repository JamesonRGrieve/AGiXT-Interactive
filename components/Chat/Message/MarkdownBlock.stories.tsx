// Import Storybook.
import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
// Import Component and related types.
import MarkdownBlockComponent, { MarkdownBlockProps } from './MarkdownBlock';
import React from 'react';
import { Button, IconButton } from '@mui/material';
import { DeleteForever } from '@mui/icons-material';
// Configure Metadata.
const meta: Meta = {
  title: 'Markdown Rendering/Markdown Block',
  component: MarkdownBlockComponent,
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
export const MarkdownBlock: Story = (args: MarkdownBlockProps) => <MarkdownBlockComponent {...args} />;
MarkdownBlock.args = {
  onClose: action('onClose'),
  onConfirm: action('onConfirm'),
  title: 'MarkdownBlock Title',
  content: 'MarkdownBlock Content',
  ButtonComponent: Button,
  ButtonProps: {
    children: 'Open MarkdownBlock',
  },
};

export const TestMarkdownBlock: Story = (args: MarkdownBlockProps) => <MarkdownBlockComponent {...args} />;
TestMarkdownBlock.args = {
  onConfirm: action('onConfirm'),
  title: 'MarkdownBlock Title',
  ButtonComponent: IconButton,
  ButtonProps: {
    children: <DeleteForever />,
    disabled: false,
    color: 'primary',
    sx: {
      height: '56px',
      padding: '1rem',
    },
  },
};
