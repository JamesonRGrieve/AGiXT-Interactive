// Import Storybook.
import type { Meta, StoryObj } from '@storybook/react';

// Import Layout Components.
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';

// Configure Metadata.
const meta = {
  title: 'Theme/Theme',
  component: Paper,
  parameters: {
    argTypes: {
      variant: {
        control: {
          type: 'radio',
          options: []
        }
      }
    }
  }
} satisfies Meta<typeof Paper>;
export default meta;
type Story = StoryObj<typeof meta>;

// Configure Component Stories.
export const MUI: Story = (args: any) => (
  <Paper
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem'
    }}
    {...args}
  >
    <Typography variant='h1'>Heading 1</Typography>
    <Typography variant='h2'>Heading 2</Typography>
    <Typography variant='h3'>Heading 3</Typography>
    <Typography variant='h4'>Heading 4</Typography>
    <Typography variant='h5'>Heading 5</Typography>
    <Typography variant='h6'>Heading 6</Typography>
    <Typography variant='subtitle1'>Subtitle 1</Typography>
    <Typography variant='subtitle2'>Subtitle 2</Typography>
    <Typography variant='body1' paragraph>
      Body 1
    </Typography>
    <Typography variant='body2' paragraph>
      Body 2
    </Typography>
    <Box display='flex' flexDirection='row' justifyContent='center' gap='0.5rem'>
      <Button variant='text' color='primary'>
        Text Primary
      </Button>
      <Button variant='outlined' color='primary'>
        Outlined Primary
      </Button>
      <Button variant='contained' color='primary'>
        Contained Primary
      </Button>
    </Box>
    <Box display='flex' flexDirection='row' justifyContent='center' gap='0.5rem'>
      <Button variant='text' color='secondary'>
        Text Secondary
      </Button>
      <Button variant='outlined' color='secondary'>
        Outlined Secondary
      </Button>
      <Button variant='contained' color='secondary'>
        Contained Secondary
      </Button>
    </Box>
    <Box display='flex' flexDirection='row' justifyContent='center' gap='0.5rem'>
      <TextField label='Standard' variant='standard' />
      <TextField label='Filled' variant='filled' />
      <TextField label='Outlined' variant='outlined' />
    </Box>
    <Box display='flex' flexDirection='row' justifyContent='center' gap='0.5rem'>
      <Select variant='standard' value='10'>
        <MenuItem value='10'>Standard 10</MenuItem>
        <MenuItem value='20'>Standard 20</MenuItem>
        <MenuItem value='30'>Standard 30</MenuItem>
      </Select>
      <Select variant='filled' value='10'>
        <MenuItem value='10'>Filled 10</MenuItem>
        <MenuItem value='20'>Filled 20</MenuItem>
        <MenuItem value='30'>Filled 30</MenuItem>
      </Select>
    </Box>
  </Paper>
);
MUI.args = {};
