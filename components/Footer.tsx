import React from 'react';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
//import Link from 'next/link';

export default function Footer({ message }: { message: string }): React.JSX.Element {
  return (
    <Box>
      <Typography
        variant='caption'
        align='center'
        style={{ width: '100%', display: 'inline-block', fontWeight: 'bold', fontSize: '0.8rem' }}
        sx={{ marginBottom: '1rem' }}
      >
        {message}
      </Typography>
    </Box>
  );
  /*
    <Box>
      <Typography
        variant='caption'
        align='center'
        style={{ width: '100%', display: 'inline-block', fontWeight: 'bold', fontSize: '0.8rem' }}
        sx={{ marginBottom: '1rem' }}
      >
        <Link style={{ textDecoration: 'none' }} href='https://github.com/Josh-XT/AGiXT'>
          {message || process.env.NEXT_PUBLIC_AGIXT_FOOTER_MESSAGE}
        </Link>{' '}
        • Built by{' '}
        <Link style={{ textDecoration: 'none' }} href='https://github.com/Josh-XT'>
          JoshXT
        </Link>{' '}
        and{' '}
        <Link style={{ textDecoration: 'none' }} href='https://github.com/jamesonrgrieve'>
          James G.
        </Link>{' '}
        &copy; 2023
      </Typography>
    </Box>
    */
}
