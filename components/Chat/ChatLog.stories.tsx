import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { mockConversation } from '../../__mocks__/mockConversations';
import ChatLog from './ChatLog';

const meta: Meta<typeof ChatLog> = {
  title: 'Chat/ChatLog',
  component: ChatLog,
  tags: ['autodocs'],
  parameters: {
    componentSubtitle: 'A ChatLog component displaying a conversation.',
    docs: {
      description: {
        component: 'The ChatLog component is used to display a series of chat messages in a conversation.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    conversation: mockConversation,
    setLoading: action('setLoading'),
    loading: false,
  },
};

export const EmptyConversation: Story = {
  args: {
    conversation: [],
    setLoading: action('setLoading'),
    loading: false,
  },
};
