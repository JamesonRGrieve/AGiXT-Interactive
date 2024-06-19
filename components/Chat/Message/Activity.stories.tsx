// Import Storybook.
import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
// Import Component and related types.
import ActivityComponent, { ActivityProps } from './Activity';
import React from 'react';
import { Button, IconButton } from '@mui/material';
import { DeleteForever } from '@mui/icons-material';
// Configure Metadata.
const meta: Meta = {
  title: 'Messaging/Activity',
  component: ActivityComponent,
  tags: ['autodocs'],
  parameters: {
    componentSubtitle: 'A Sample Component',
    docs: {
      description: {
        component: 'This component is meant to illustrate how to effectively document components.',
      },
    },
    references: [],
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

// Configure Component Stories.

export const PendingActivity: Story = (args: ActivityProps) => <ActivityComponent {...args} />;
PendingActivity.args = {
  inProgress: true,
  severity: 'success',
  message: 'Doing a thing.',
};

export const CompleteActivity: Story = (args: ActivityProps) => <ActivityComponent {...args} />;
CompleteActivity.args = {
  inProgress: false,
  severity: 'success',
  message: 'Doing a thing.',
};

export const ActivityWarning: Story = (args: ActivityProps) => <ActivityComponent {...args} />;
ActivityWarning.args = {
  inProgress: false,
  severity: 'warn',
  message: 'Doing a thing.',
};

export const ActivityError: Story = (args: ActivityProps) => <ActivityComponent {...args} />;
ActivityError.args = {
  inProgress: false,
  severity: 'error',
  message: 'Doing a thing.',
};

export const ActivityInfo: Story = (args: ActivityProps) => <ActivityComponent {...args} />;
ActivityInfo.args = {
  inProgress: false,
  severity: 'info',
  message: 'Doing a thing.',
};
