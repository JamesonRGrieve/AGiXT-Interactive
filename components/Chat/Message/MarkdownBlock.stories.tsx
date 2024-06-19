// Import Storybook.
import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
// Import Component and related types.
import MarkdownBlockComponent, { MarkdownBlockProps } from './MarkdownBlock';
import React from 'react';
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
    layout: 'centered',
    references: [],
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

// Configure Component Stories.
export const MarkdownHeading: Story = (args: MarkdownBlockProps) => <MarkdownBlockComponent {...args} />;
MarkdownHeading.args = {
  content: '# Heading 1\n## Heading 2\n### Heading 3\n#### Heading 4\n##### Heading 5\n###### Heading 6',
};

export const MarkdownLink: Story = (args: MarkdownBlockProps) => <MarkdownBlockComponent {...args} />;
MarkdownLink.args = {
  content: '[This is a link to an example website.](https://www.example.com)',
};

export const MarkdownList: Story = (args: MarkdownBlockProps) => <MarkdownBlockComponent {...args} />;
MarkdownList.args = {
  content:
    '- Unordered List Item 1\n- Unordered List Item 2\n- Unordered List Item 3\n\n1. Ordered List Item 1\n2. Ordered List Item 2\n3. Ordered List Item 3',
};
