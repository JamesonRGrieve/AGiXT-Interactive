// Import Storybook.
import type { Meta, StoryObj } from '@storybook/react';

// Import Reference Images.
import SampleReferenceImagePrimary from '@/.storybook/ref/Sample/Primary.png';
import SampleReferenceImageSecondary from '@/.storybook/ref/Sample/Secondary.png';

// Import Component and related types.
import SwitchColorblindComponent, {SwitchColorblindProps} from './SwitchColorblind';

// Configure Metadata.
const meta: Meta = {
  title: 'Styled/Switch/Colorblind',
  component: SwitchColorblindComponent,
  tags: ['autodocs'],
  argTypes: {
  },
  parameters: {
    componentSubtitle: 'A Sample Component',
    docs: {
      description: {
        component: 'This component is meant to illustrate how to effectively document components.'
      }
    },
    referenceImages : [
      {
        image: SampleReferenceImagePrimary,
        primary: true
      },
      {
        image: SampleReferenceImageSecondary
      },
    ]
  }
};
export default meta;
type Story = StoryObj<typeof meta>;

// Configure Component Stories.
export const SwitchColorblind: Story = (args: SwitchColorblindProps) => <SwitchColorblindComponent {...args} />;
SwitchColorblind.args = {};

