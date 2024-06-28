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
export const MarkdownParagraphs: Story = (args: MarkdownBlockProps) => <MarkdownBlockComponent {...args} />;
MarkdownParagraphs.args = {
  content:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum et commodo nisi. Cras dui erat, consequat in lacus at, eleifend maximus ante. Sed accumsan efficitur sem, quis eleifend sem placerat vel. Donec eu ante quis est malesuada scelerisque sed at nulla. In a molestie nisl. Integer iaculis ante urna. Morbi aliquam lacus vitae quam consequat, sed venenatis libero auctor. Proin volutpat dignissim tortor. Fusce et dolor quis dui elementum porta.\n\nMauris eu nibh mattis, mollis augue ut, egestas turpis. Curabitur nec dolor sit amet justo fringilla dignissim at et ligula. Cras vitae nibh auctor nisi blandit volutpat non eu dolor. Aenean sagittis ullamcorper eros, at egestas tortor. Vivamus et bibendum mi, eu congue erat. Nullam ut enim non purus pulvinar cursus. Donec sit amet nulla at felis condimentum dapibus egestas et sapien. Phasellus magna eros, dapibus eu placerat id, efficitur ut nunc. Suspendisse suscipit non eros sit amet venenatis. Integer id dolor dui. Aliquam sollicitudin consequat tincidunt. Nulla non magna at tortor faucibus malesuada. Vestibulum scelerisque, erat sit amet porttitor ultrices, nisi ante blandit neque, eget aliquam risus purus sed ex. Curabitur mollis, ex sit amet elementum volutpat, mi tortor condimentum elit, in congue quam ipsum id lectus.\n\nDonec scelerisque dolor lectus, eu commodo nisi rhoncus rhoncus. Praesent erat sem, aliquet sed convallis sit amet, dictum eget leo. Sed lacinia et risus non pellentesque. Aenean dapibus posuere odio, non dapibus ligula bibendum at. Proin gravida velit eget interdum venenatis. Quisque elit nibh, feugiat vel erat eu, congue rutrum lectus. Proin mi lorem, vulputate vel dolor nec, ultrices vestibulum libero. Integer quis odio viverra, gravida elit nec, ullamcorper ex. Morbi faucibus est in lacus commodo aliquam in in nibh.\n\nPellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Quisque iaculis, purus non elementum mollis, erat purus pulvinar purus, a ultricies lectus dolor quis massa. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed non arcu dictum metus fringilla auctor. Vestibulum ut orci lacus. Quisque tempor est sit amet massa egestas iaculis. Sed eget lacus nibh. Suspendisse potenti. Praesent vel sem felis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Proin ornare mauris quam, id tincidunt nisl egestas sit amet. Fusce dapibus pulvinar lacinia. Quisque sed mollis purus, tristique feugiat elit. Quisque volutpat sodales nisl. Cras pretium ut quam non varius.\n\nCras congue egestas pharetra. Etiam eleifend maximus tellus, sit amet volutpat ante mattis a. Sed nulla ipsum, malesuada non eros at, pulvinar mollis felis. Sed eu euismod justo. Aenean id venenatis orci. Mauris molestie finibus metus et viverra. In nec molestie lacus. Nullam sollicitudin ex sit amet nulla laoreet, ut pretium est pulvinar. Aenean dictum cursus posuere. Nam porta, nibh in cursus vestibulum, ipsum elit elementum eros, ac consequat orci magna molestie arcu. Sed eget efficitur nunc.',
};
export const MarkdownSpacing: Story = (args: MarkdownBlockProps) => <MarkdownBlockComponent {...args} />;
MarkdownSpacing.args = {
  content:
    '\n\n\n# Here is Spacing\nFollowed by 5 line breaks.\n\n\n\n\nFollowed by 4 line breaks.\n\n\n\nFollowed by 3 line breaks.\n\n\nFollowed by 2 line breaks.\n\nFollowed by 1 line break.\nDone.\n\n\n',
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

export const MarkdownTable: Story = (args: MarkdownBlockProps) => <MarkdownBlockComponent {...args} />;
MarkdownTable.args = {
  content:
    '| Feature    | Support              |\n| ---------: | :------------------- |\n| CommonMark | 100%                 |\n| GFM        | 100% w/ `remark-gfm` |',
};

export const MarkdownStrikethrough: Story = (args: MarkdownBlockProps) => <MarkdownBlockComponent {...args} />;
MarkdownStrikethrough.args = {
  content: '~~strikethrough~~',
};
