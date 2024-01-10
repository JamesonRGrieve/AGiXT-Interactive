'use client';
import { Typography, useTheme } from '@mui/material';
import React, { ReactNode } from 'react';

export default function Home(): ReactNode {
  const theme = useTheme();
  return (
    <Typography
      variant='h1'
      textAlign='center'
      onClick={() => {
        console.log(theme);
      }}
    >
      Home Page
    </Typography>
  );
}
