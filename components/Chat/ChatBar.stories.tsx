import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ChatBar from './ChatBar';

const mockOnSend = async (message: string | object, uploadedFiles?: { [x: string]: string }) => {
  console.log('Message sent:', message, 'Files:', uploadedFiles);
  return 'Message sent';
};

const meta: Meta<typeof ChatBar> = {
  title: 'Messaging/ChatBar',
  component: ChatBar,
  tags: ['autodocs'],
  parameters: {
    componentSubtitle: 'A ChatBar component for sending messages with optional file and voice input.',
    docs: {
      description: {
        component: 'The ChatBar component allows users to send messages, upload files, and use voice input.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof ChatBar>;

export const Default: Story = {
  args: {
    onSend: mockOnSend,
    disabled: false,
    loading: false,
    setLoading: (loading: boolean) => console.log('Loading:', loading),
    clearOnSend: true,
    showChatThemeToggles: true,
    enableFileUpload: true,
    enableVoiceInput: true,
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    loading: true,
  },
};

export const WithoutFileUpload: Story = {
  args: {
    ...Default.args,
    enableFileUpload: false,
  },
};

export const WithoutVoiceInput: Story = {
  args: {
    ...Default.args,
    enableVoiceInput: false,
  },
};