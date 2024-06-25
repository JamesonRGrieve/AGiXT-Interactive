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

export const MarkdownSpacing: Story = (args: MarkdownBlockProps) => <MarkdownBlockComponent {...args} />;
MarkdownSpacing.args = {
  content: 'Lets build some markdown examples. \n\n\n\nStart with 4 line breaks in a row, then a list of bullet points.',
};

export const MarkdownLink: Story = (args: MarkdownBlockProps) => <MarkdownBlockComponent {...args} />;
MarkdownLink.args = {
  content: '[This is a link to an example website.](https://www.example.com)',
};

export const MarkdownList: Story = (args: MarkdownBlockProps) => <MarkdownBlockComponent {...args} />;
MarkdownList.args = {
  content:
    '### Unordered List\nBody text here.\n- Unordered List Item 1\n- Unordered List Item 2\n- Unordered List Item 3\n\n### Ordered List\nBody text here.\n1. Ordered List Item 1\n2. Ordered List Item 2\n3. Ordered List Item 3\n4. Ordered List Item 4\n5. Ordered List Item 5\n6. Ordered List Item 6\n7. Ordered List Item 7\n8. Ordered List Item 8\n9. Ordered List Item 9\n10. Ordered List Item 10',
};

export const MarkdownInlineCode: Story = (args: MarkdownBlockProps) => <MarkdownBlockComponent {...args} />;
MarkdownInlineCode.args = {
  content: 'Here is some `inline code` for an example.',
};

export const MarkdownImage: Story = (args: MarkdownBlockProps) => <MarkdownBlockComponent {...args} />;
MarkdownImage.args = {
  content: '![This is an example image.](https://via.placeholder.com/150)',
};

export const MarkdownCodeBlock: Story = (args: MarkdownBlockProps) => <MarkdownBlockComponent {...args} />;
MarkdownCodeBlock.args = {
  content:
    'Here is a code block:\n\n```javascript\nconsole.log("Hello, World!");\n```\n```csv\nFirstName, LastName, Age\nJohn, Doe, 30\nJane, Doe, 28\nAlice, Smith, 35\n```',
};

export const MarkdownEscapedCodeBlock: Story = (args: MarkdownBlockProps) => <MarkdownBlockComponent {...args} />;
MarkdownEscapedCodeBlock.args = {
  content: 'Here is an escaped code block:\n\n\\```javascript\nconsole.log("Hello, World!");\n```',
};
