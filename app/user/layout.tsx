import { Box, Typography } from '@mui/material';
import React, { ReactNode } from 'react';

export default function UserLayout({ children }: { children: ReactNode }): ReactNode {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1rem',
        height: '100%',
        width: '100%',
        overflowY: 'scroll',
      }}
    >
      <Typography variant='h4' component='h2'>
        Authentication
      </Typography>
      {children}
    </Box>
  );
}
