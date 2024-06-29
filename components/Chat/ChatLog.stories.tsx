import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { action } from '@storybook/addon-actions';
import ChatLog from './ChatLog';

const mockConversation = []; // Fix by adding better context providers

const theme = createTheme();

const meta: Meta<typeof ChatLog> = {
  title: 'Chat/ChatLog',
  component: ChatLog,
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <Story />
      </ThemeProvider>
    ),
  ],
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
    alternateBackground: '',
  },
};

export const EmptyConversation: Story = {
  args: {
    ...Default.args,
  },
};
