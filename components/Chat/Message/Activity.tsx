'use client';
import { Cancel, CheckCircle, Pending } from '@mui/icons-material';
import { Box, useTheme } from '@mui/material';
import React, { ReactNode, useEffect, useState } from 'react';

export default function Activity({
  inProgress,
  message,
  error,
  alternateBackground,
}: {
  inProgress: boolean;
  error: boolean;
  message: string;
  alternateBackground: string;
}): ReactNode {
  const theme = useTheme();
  const [dots, setDots] = useState<string>('');
  useEffect(() => {
    if (inProgress) {
      const interval = setInterval(() => setDots((dots) => (dots.length < 2 ? dots + '.' : '')), 500);
      return () => clearInterval(interval);
    }
  }, [inProgress]);
  return (
    <Box
      sx={{
        backgroundColor: theme.palette[String(alternateBackground)][theme.palette.mode],
        padding: '10px',
        overflow: 'hidden',
        position: 'center',
        color: theme.palette.text.primary,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}
    >
      {error ? <Cancel color='error' /> : inProgress ? <Pending color='info' /> : <CheckCircle color='success' />}
      {message + dots}
    </Box>
  );
}
