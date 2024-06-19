'use client';
import { AutorenewOutlined, Cancel, CheckCircle, Info, Warning } from '@mui/icons-material';
import { Box, keyframes, styled, useTheme, Tooltip, Typography } from '@mui/material';
import React, { ReactNode, useEffect, useState } from 'react';
import formatDate from './formatDate';
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinningIcon = styled(AutorenewOutlined)`
  animation: ${spin} 3s linear infinite;
`;
const severities = {
  error: <Cancel color='error' />,
  info: <Info color='info' />,
  success: <CheckCircle color='success' />,
  warn: <Warning color='warning' />,
};
export type ActivityProps = {
  inProgress: boolean;
  severity: 'error' | 'info' | 'success' | 'warn';
  message: string;
  alternateBackground?: string;
  timestamp: string;
};
export default function Activity({
  inProgress,
  message,
  severity,
  alternateBackground = 'primary',
  timestamp,
}: ActivityProps): ReactNode {
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
      {inProgress ? <SpinningIcon /> : severities[severity.toString()]}
      <Tooltip title={formatDate(timestamp, false)}>
        <Typography variant='body1' display='flex' alignItems='center' margin='0'>
          {message + dots}
        </Typography>
      </Tooltip>
    </Box>
  );
}
