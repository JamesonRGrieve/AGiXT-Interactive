// Import Storybook.
import type { Meta, StoryObj } from '@storybook/react';

// Import Reference Images.
import SampleReferenceImagePrimary from '@/.storybook/ref/Sample/Primary.png';
import SampleReferenceImageSecondary from '@/.storybook/ref/Sample/Secondary.png';

// Import Component and related types.
import SampleComponent, { SampleProps } from './Sample';

type Story = StoryObj<typeof meta>;

// Configure Component Stories.
export const Sample: Story = (args: SampleProps) => <SampleComponent {...args} />;
Sample.args = {
  heading: 'Sample Component',
  bodyText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  buttonText: 'Click Me!'
};

// Configure Metadata.
const meta: Meta = {
  title: 'Sample/Sample',
  component: SampleComponent,
  tags: ['autodocs'],
  argTypes: {
    heading: { control: 'text' },
    bodyText: { control: 'text' },
    buttonText: { control: 'text' }
  },
  parameters: {
    componentSubtitle: 'A Sample Component',
    docs: {
      description: {
        component: 'This component is meant to illustrate how to effectively document components.'
      }
    },
    references: [
      {
        variant: "Primary",
        story: Sample,
        images: [
          {
            image: SampleReferenceImagePrimary,
            primary: true
          },
          {
            image: SampleReferenceImageSecondary
          },
        ]
      }
    ]
  }
};
export default meta;