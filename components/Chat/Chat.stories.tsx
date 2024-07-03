import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { MockInteractiveConfigProvider } from '../../__mocks__/MockInteractiveConfigProvider';
import Chat from './Chat';

const meta: Meta<typeof Chat> = {
  title: 'Chat/Chat',
  component: Chat,
  decorators: [
    (Story) => (
      <MockInteractiveConfigProvider>
        <Story />
      </MockInteractiveConfigProvider>
    ),
  ],
  parameters: {
    componentSubtitle: 'A Chat component including ChatLog and ChatBar.',
    docs: {
      description: {
        component: 'The Chat component integrates ChatLog and ChatBar to provide a complete chat interface.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    showChatThemeToggles: true,
    alternateBackground: 'primary',
    enableFileUpload: true,
    enableVoiceInput: true,
    showOverrideSwitches: true,
  },
};
