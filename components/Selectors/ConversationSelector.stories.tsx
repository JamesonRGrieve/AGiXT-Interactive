import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { MockInteractiveConfigProvider } from '../../__mocks__/MockInteractiveConfigProvider';
import ConversationSelector from './ConversationSelector';

const meta: Meta<typeof ConversationSelector> = {
  title: 'Interactive/ConversationSelector',
  component: ConversationSelector,
  decorators: [
    (Story) => (
      <MockInteractiveConfigProvider>
        <Story />
      </MockInteractiveConfigProvider>
    ),
  ],
  parameters: {
    componentSubtitle:
      'The conversation selector component that allows users to select, rename, delete, and export conversations.',
    docs: {
      description: {
        component:
          'The ConversationSelector component provides a UI for selecting, renaming, deleting, and exporting conversations.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
