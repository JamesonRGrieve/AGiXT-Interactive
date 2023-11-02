// Import Storybook.
import type { Meta, StoryObj } from '@storybook/react';

// Import Reference Images.
import SampleReferenceImagePrimary from '@/.storybook/ref/Sample/Primary.png';
import SampleReferenceImageSecondary from '@/.storybook/ref/Sample/Secondary.png';

// Import Component and related types.
import SwitchDarkComponent, {SwitchDarkProps} from './SwitchDark';

// Configure Metadata.
const meta: Meta = {
  title: 'Styled/Switch/Dark',
  component: SwitchDarkComponent,
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
    references: []
  }
};
export default meta;
type Story = StoryObj<typeof meta>;

// Configure Component Stories.
export const SwitchDark: Story = (args: SwitchDarkProps) => <SwitchDarkComponent {...args} />;
SwitchDark.args = {};

