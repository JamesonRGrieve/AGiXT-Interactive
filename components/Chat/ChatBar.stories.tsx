import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within, expect } from '@storybook/test';
import ChatBar from './ChatBar';

const mockOnSend = async (message: string | object, uploadedFiles?: { [x: string]: string }) => {
  console.log('Message sent:', message, 'Files:', uploadedFiles);
  return 'Message sent';
};

const meta: Meta<typeof ChatBar> = {
  title: 'Chat/ChatBar',
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('textbox'));
    await userEvent.type(canvas.getByRole('textbox'), 'Hello, World!');
    await userEvent.click(canvas.getByTestId('send-message-button'));
    await expect(canvas.getByRole('textbox')).toHaveValue('');
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

// Interaction tests

/*
1. Send message (shouldn't send on empty, and should clean on send)
2. Upload file (should open a dialog and files should show up when uploaded)
3. Using voice?
4. Loading state
5. Settings toggle (should open and settings should be toggled)
6. Disabled state

*/

