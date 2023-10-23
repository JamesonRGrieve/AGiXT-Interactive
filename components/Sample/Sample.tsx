import { Paper, Button, Typography } from '@mui/material';
import {useTheme} from '@mui/material/styles';
export type SampleProps = {
  heading: string;
  bodyText: string;
  buttonText: string;
};

const Sample: React.FC<SampleProps> = ({ heading, bodyText, buttonText }) => {
  return (
    <Paper sx={{padding: '3rem'}}>
      <Typography variant='h1' color='primary.dark' align='center' textTransform={'uppercase'} mb='0.5rem'>{heading}</Typography>
      <Typography variant='body1' paragraph align='center'>{bodyText}</Typography>
      <Button sx={{display: 'block', margin: '0 auto', padding: '2rem'}} variant='contained' color='primary'>{buttonText}</Button>
    </Paper>
  );
};

export default Sample;
