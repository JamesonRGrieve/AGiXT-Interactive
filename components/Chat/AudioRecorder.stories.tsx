import type { Meta, StoryObj } from '@storybook/react';
import AudioRecorder from './AudioRecorder';
import { action } from '@storybook/addon-actions';

// Define mock functions
const setRecording = action('setRecording');
const onSend = action('onSend');

const meta: Meta<typeof AudioRecorder> = {
  title: 'Chat/AudioRecorder',
  component: AudioRecorder,
  tags: ['autodocs'],
  parameters: {
    componentSubtitle: 'A component to record and send audio messages.',
    docs: {
      description: {
        component: 'The AudioRecorder component allows users to record and send audio messages.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    recording: false,
    setRecording,
    disabled: false,
    onSend,
  },
};

export const Recording: Story = {
  args: {
    recording: true,
    setRecording,
    disabled: false,
    onSend,
  },
};

export const Disabled: Story = {
  args: {
    recording: false,
    setRecording,
    disabled: true,
    onSend,
  },
};