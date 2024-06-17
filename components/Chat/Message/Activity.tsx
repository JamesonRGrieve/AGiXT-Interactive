'use client';
import { Cancel, CheckCircle, Info, Pending, Warning } from '@mui/icons-material';
import { Box, useTheme } from '@mui/material';
import React, { ReactNode, useEffect, useState } from 'react';

const severities = {
  error: <Cancel color='error' />,
  info: <Info color='info' />,
  success: <CheckCircle color='success' />,
  warn: <Warning color='warning' />,
};

export default function Activity({
  inProgress,
  message,
  severity,
  alternateBackground,
}: {
  inProgress: boolean;
  severity: 'error' | 'info' | 'success' | 'warn';
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
      {severities[severity.toString()]}
      {message + dots}
    </Box>
  );
}
